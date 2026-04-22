import { getAll, getFirst, run } from "./sqlite";

function ok(data) {
  return { ok: true, data, error: null };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "outbox_error",
      message: error?.message || "Unexpected outbox error",
    },
  };
}

function parsePayload(payloadJson) {
  try {
    return JSON.parse(payloadJson || "null");
  } catch (_error) {
    return null;
  }
}

export function enqueueOutboxOperation({ entityType, operation, payload, status = "pending" }) {
  if (!entityType || !operation) {
    return fail({
      code: "missing_outbox_fields",
      message: "entityType and operation are required",
    });
  }

  try {
    const createdAt = Date.now();

    run(
      "INSERT INTO outbox_queue (entityType, operation, payloadJson, createdAt, retryCount, status, lastError) VALUES (?, ?, ?, ?, ?, ?, ?)",
      entityType,
      operation,
      JSON.stringify(payload || {}),
      createdAt,
      0,
      status,
      null
    );

    const inserted = getFirst("SELECT id FROM outbox_queue ORDER BY id DESC LIMIT 1");
    return ok(inserted?.id || null);
  } catch (error) {
    return fail(error);
  }
}

export function listPendingOutboxOperations(limitCount = 100) {
  try {
    const rows = getAll(
      "SELECT id, entityType, operation, payloadJson, createdAt, retryCount, status, lastError FROM outbox_queue WHERE status IN ('pending', 'failed') ORDER BY createdAt ASC LIMIT ?",
      Number(limitCount)
    );

    return ok(
      rows.map((row) => ({
        id: row.id,
        entityType: row.entityType,
        operation: row.operation,
        payload: parsePayload(row.payloadJson),
        createdAt: row.createdAt,
        retryCount: row.retryCount,
        status: row.status,
        lastError: row.lastError,
      }))
    );
  } catch (error) {
    return fail(error);
  }
}

export function markOutboxOperationSynced(id) {
  if (!id) {
    return fail({ code: "missing_id", message: "id is required" });
  }

  try {
    run("UPDATE outbox_queue SET status = 'synced', lastError = NULL WHERE id = ?", id);
    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function markOutboxOperationFailed(id, errorMessage, retryCount) {
  if (!id) {
    return fail({ code: "missing_id", message: "id is required" });
  }

  try {
    const current = getFirst("SELECT retryCount FROM outbox_queue WHERE id = ?", id);
    const nextRetry = Number.isInteger(retryCount)
      ? retryCount
      : Number(current?.retryCount || 0) + 1;

    run(
      "UPDATE outbox_queue SET status = 'failed', retryCount = ?, lastError = ? WHERE id = ?",
      nextRetry,
      errorMessage || "Unknown sync failure",
      id
    );

    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function deleteOutboxOperation(id) {
  if (!id) {
    return fail({ code: "missing_id", message: "id is required" });
  }

  try {
    run("DELETE FROM outbox_queue WHERE id = ?", id);
    return ok(true);
  } catch (error) {
    return fail(error);
  }
}
