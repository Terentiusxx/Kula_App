import { getFirst, run, withTransaction } from "./sqlite";

const TABLE_DEFINITIONS = [
  "CREATE TABLE IF NOT EXISTS users_cache (id TEXT PRIMARY KEY NOT NULL, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS communities_cache (id TEXT PRIMARY KEY NOT NULL, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS events_cache (id TEXT PRIMARY KEY NOT NULL, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS threads_cache (id TEXT PRIMARY KEY NOT NULL, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS messages_cache (id TEXT PRIMARY KEY NOT NULL, thread_id TEXT, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS outbox_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, entityType TEXT NOT NULL, operation TEXT NOT NULL, payloadJson TEXT NOT NULL, createdAt INTEGER NOT NULL, retryCount INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending', lastError TEXT)",
  "CREATE TABLE IF NOT EXISTS ui_state_cache (state_key TEXT PRIMARY KEY NOT NULL, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL)",
];

const TABLE_NAMES = [
  "users_cache",
  "communities_cache",
  "events_cache",
  "threads_cache",
  "messages_cache",
  "outbox_queue",
  "ui_state_cache",
];

function ok(data) {
  return { ok: true, data, error: null };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "sqlite_error",
      message: error?.message || "Unexpected sqlite error",
    },
  };
}

export function initializeSchema() {
  try {
    withTransaction(() => {
      TABLE_DEFINITIONS.forEach((statement) => run(statement));
    });

    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function clearSchemaData() {
  try {
    withTransaction(() => {
      TABLE_NAMES.forEach((tableName) => run("DELETE FROM " + tableName));
    });

    return ok(true);
  } catch (error) {
    return fail(error);
  }
}

export function runLocalDbSmokeTest() {
  const cacheProbeId = "smoke-users-" + Date.now();

  try {
    const payloadJson = JSON.stringify({ source: "smoke_test" });
    const timestamp = Date.now();

    run(
      "INSERT INTO users_cache (id, payload_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at",
      cacheProbeId,
      payloadJson,
      timestamp
    );

    const userRow = getFirst("SELECT id FROM users_cache WHERE id = ?", cacheProbeId);

    run(
      "INSERT INTO outbox_queue (entityType, operation, payloadJson, createdAt, retryCount, status, lastError) VALUES (?, ?, ?, ?, ?, ?, ?)",
      "smoke",
      "write",
      payloadJson,
      timestamp,
      0,
      "pending",
      null
    );

    const outboxRow = getFirst(
      "SELECT id FROM outbox_queue WHERE entityType = ? ORDER BY id DESC LIMIT 1",
      "smoke"
    );

    run("DELETE FROM users_cache WHERE id = ?", cacheProbeId);
    if (outboxRow?.id) {
      run("DELETE FROM outbox_queue WHERE id = ?", outboxRow.id);
    }

    if (!userRow?.id || !outboxRow?.id) {
      return fail({
        code: "sqlite_smoke_failed",
        message: "Unable to read/write required cache and outbox records",
      });
    }

    return ok(true);
  } catch (error) {
    try {
      run("DELETE FROM users_cache WHERE id = ?", cacheProbeId);
    } catch (_cleanupError) {
      // Ignore cleanup failure when schema init itself failed.
    }
    return fail(error);
  }
}

export { TABLE_NAMES };
