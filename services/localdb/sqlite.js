import { openDatabaseSync } from "expo-sqlite";

const DATABASE_NAME = "kula.db";
let databaseInstance = null;

function getInstance() {
  if (!databaseInstance) {
    databaseInstance = openDatabaseSync(DATABASE_NAME);
  }

  return databaseInstance;
}

export function getDatabase() {
  return getInstance();
}

export function run(sql, ...params) {
  return getInstance().runSync(sql, ...params);
}

export function getFirst(sql, ...params) {
  return getInstance().getFirstSync(sql, ...params);
}

export function getAll(sql, ...params) {
  return getInstance().getAllSync(sql, ...params);
}

export function withTransaction(task) {
  const db = getInstance();
  db.withTransactionSync(() => {
    task(db);
  });
}
