import { getAll, getFirst, run } from "./sqlite";

const CACHE_TABLES = new Set([
  "users_cache",
  "communities_cache",
  "events_cache",
  "threads_cache",
  "messages_cache",
]);

function ok(data) {
  return { ok: true, data, error: null };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "cache_error",
      message: error?.message || "Unexpected cache error",
    },
  };
}

function parsePayload(value) {
  try {
    return JSON.parse(value || "null");
  } catch (_error) {
    return null;
  }
}

function validateTable(tableName) {
  if (!CACHE_TABLES.has(tableName)) {
    throw new Error("Unsupported cache table: " + tableName);
  }
}

export function upsertCacheRecord(tableName, id, payload) {
  if (!id) {
    return fail({ code: "missing_id", message: "id is required" });
  }

  try {
    validateTable(tableName);
    const payloadJson = JSON.stringify(payload || {});
    const updatedAt = Date.now();

    run(
      "INSERT INTO " +
        tableName +
        " (id, payload_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at",
      id,
      payloadJson,
      updatedAt
    );

    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function getCacheRecord(tableName, id) {
  if (!id) {
    return fail({ code: "missing_id", message: "id is required" });
  }

  try {
    validateTable(tableName);
    const row = getFirst("SELECT id, payload_json, updated_at FROM " + tableName + " WHERE id = ?", id);

    if (!row) {
      return ok(null);
    }

    return ok({
      id: row.id,
      payload: parsePayload(row.payload_json),
      updatedAt: row.updated_at,
    });
  } catch (error) {
    return fail(error);
  }
}

export function listCacheRecords(tableName, limitCount = 100) {
  try {
    validateTable(tableName);
    const rows = getAll(
      "SELECT id, payload_json, updated_at FROM " + tableName + " ORDER BY updated_at DESC LIMIT ?",
      Number(limitCount)
    );

    return ok(
      rows.map((row) => ({
        id: row.id,
        payload: parsePayload(row.payload_json),
        updatedAt: row.updated_at,
      }))
    );
  } catch (error) {
    return fail(error);
  }
}

export function upsertThreadMessageRecord(messageId, threadId, payload) {
  if (!messageId || !threadId) {
    return fail({
      code: "missing_message_keys",
      message: "messageId and threadId are required",
    });
  }

  try {
    const payloadJson = JSON.stringify(payload || {});
    const updatedAt = Date.now();

    run(
      "INSERT INTO messages_cache (id, thread_id, payload_json, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET thread_id = excluded.thread_id, payload_json = excluded.payload_json, updated_at = excluded.updated_at",
      messageId,
      threadId,
      payloadJson,
      updatedAt
    );

    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function listThreadMessageRecords(threadId, limitCount = 200) {
  if (!threadId) {
    return fail({ code: "missing_thread_id", message: "threadId is required" });
  }

  try {
    const rows = getAll(
      "SELECT id, thread_id, payload_json, updated_at FROM messages_cache WHERE thread_id = ? ORDER BY updated_at DESC LIMIT ?",
      threadId,
      Number(limitCount)
    );

    return ok(
      rows.map((row) => ({
        id: row.id,
        threadId: row.thread_id,
        payload: parsePayload(row.payload_json),
        updatedAt: row.updated_at,
      }))
    );
  } catch (error) {
    return fail(error);
  }
}

export function upsertUiState(stateKey, payload) {
  if (!stateKey) {
    return fail({ code: "missing_state_key", message: "stateKey is required" });
  }

  try {
    run(
      "INSERT INTO ui_state_cache (state_key, payload_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(state_key) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at",
      stateKey,
      JSON.stringify(payload || {}),
      Date.now()
    );

    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function getUiState(stateKey) {
  if (!stateKey) {
    return fail({ code: "missing_state_key", message: "stateKey is required" });
  }

  try {
    const row = getFirst(
      "SELECT state_key, payload_json, updated_at FROM ui_state_cache WHERE state_key = ?",
      stateKey
    );

    if (!row) {
      return ok(null);
    }

    return ok({
      stateKey: row.state_key,
      payload: parsePayload(row.payload_json),
      updatedAt: row.updated_at,
    });
  } catch (error) {
    return fail(error);
  }
}

export function removeUiState(stateKey) {
  if (!stateKey) {
    return fail({ code: "missing_state_key", message: "stateKey is required" });
  }

  try {
    run("DELETE FROM ui_state_cache WHERE state_key = ?", stateKey);
    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function saveDraftState(draftKey, payload) {
  return upsertUiState("draft:" + draftKey, payload || {});
}

export function readDraftState(draftKey) {
  return getUiState("draft:" + draftKey);
}
