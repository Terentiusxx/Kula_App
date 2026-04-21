import {
  enqueueOutboxOperation,
  listPendingOutboxOperations,
  markOutboxOperationFailed,
  markOutboxOperationSynced,
} from "../localdb/outboxRepository";
import { isOnline, subscribeToConnectivityChanges } from "../network/connectivityService";

function ok(data) {
  return { ok: true, data, error: null };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "sync_error",
      message: error?.message || "Unexpected sync error",
    },
  };
}

function resolveProcessor(processors, item) {
  if (!processors) {
    return null;
  }

  return (
    processors[item.entityType + ":" + item.operation] ||
    processors[item.entityType] ||
    processors.default ||
    null
  );
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function executeWithRetry(processor, item, options = {}) {
  const maxRetries = Number.isInteger(options.maxRetries) ? options.maxRetries : 3;
  const baseDelayMs = Number.isInteger(options.baseDelayMs) ? options.baseDelayMs : 500;
  const startAttempt = Number(item?.retryCount || 0);
  const maxAttempts = Math.max(startAttempt + 1, maxRetries + 1);

  let lastError = null;
  for (let attempt = startAttempt; attempt < maxAttempts; attempt += 1) {
    try {
      const outcome = await processor(item);
      if (outcome === false) {
        throw new Error("Processor returned unsuccessful result");
      }

      return { ok: true, attempts: attempt + 1, error: null };
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt >= maxAttempts - 1;
      if (!isLastAttempt) {
        const waitMs = baseDelayMs * Math.pow(2, attempt - startAttempt);
        await sleep(waitMs);
      }
    }
  }

  return {
    ok: false,
    attempts: maxAttempts,
    error: lastError,
  };
}

export async function syncOutbox(processors = {}, options = {}) {
  const online = await isOnline();
  if (!online) {
    return ok({ processed: 0, synced: 0, failed: 0, skipped: true, reason: "offline" });
  }

  const pendingResult = listPendingOutboxOperations(options.limitCount || 100);
  if (!pendingResult.ok) {
    return pendingResult;
  }

  const report = {
    processed: 0,
    synced: 0,
    failed: 0,
    skipped: false,
    reason: null,
  };

  for (const item of pendingResult.data) {
    report.processed += 1;

    const processor = resolveProcessor(processors, item);
    if (!processor) {
      markOutboxOperationFailed(item.id, "No processor registered for operation");
      report.failed += 1;
      continue;
    }

    try {
      const execution = await executeWithRetry(processor, item, options);
      if (!execution.ok) {
        markOutboxOperationFailed(
          item.id,
          execution.error?.message || "Processor execution failed",
          execution.attempts
        );
        report.failed += 1;
        continue;
      }
      markOutboxOperationSynced(item.id);
      report.synced += 1;
    } catch (error) {
      markOutboxOperationFailed(item.id, error?.message || "Processor execution failed");
      report.failed += 1;
    }
  }

  return ok(report);
}

export async function queueOrProcessWrite(
  operationInput,
  processors = {},
  options = {}
) {
  const outboxResult = enqueueOutboxOperation(operationInput);
  if (!outboxResult.ok) {
    return outboxResult;
  }

  const online = await isOnline();
  if (!online) {
    return ok({
      queued: true,
      synced: false,
      outboxId: outboxResult.data,
      reason: "offline",
    });
  }

  const syncResult = await syncOutbox(processors, options);
  if (!syncResult.ok) {
    return syncResult;
  }

  return ok({
    queued: true,
    synced: true,
    outboxId: outboxResult.data,
    syncReport: syncResult.data,
  });
}

export function startOutboxAutoSync(processors = {}, options = {}) {
  const onError = typeof options.onError === "function" ? options.onError : null;
  let syncing = false;

  return subscribeToConnectivityChanges(async (state) => {
    if (!state.isOnline || syncing) {
      return;
    }

    syncing = true;
    const result = await syncOutbox(processors, options);
    if (!result.ok && onError) {
      onError(result.error);
    }
    syncing = false;
  });
}
