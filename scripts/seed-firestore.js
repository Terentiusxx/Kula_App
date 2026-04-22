#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { buildSeedData } = require("./seed-data");

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    reset: argv.includes("--reset"),
  };
}

function requireServiceAccountPath() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!serviceAccountPath) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_PATH. Example: set FIREBASE_SERVICE_ACCOUNT_PATH=C:\\path\\service-account.json"
    );
  }
  const resolved = path.resolve(serviceAccountPath);
  if (!fs.existsSync(resolved)) {
    throw new Error("Service account file not found: " + resolved);
  }
  return resolved;
}

function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const serviceAccountFile = requireServiceAccountPath();
  const credentialJson = JSON.parse(fs.readFileSync(serviceAccountFile, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(credentialJson),
  });

  return admin.firestore();
}

function collectionMap(seed) {
  return {
    users: seed.users,
    communities: seed.communities,
    events: seed.events,
    posts: seed.posts,
    community_memberships: seed.communityMemberships,
    event_attendees: seed.eventAttendees,
    chats: seed.chats,
    notifications: seed.notifications,
    wisdom_posts: seed.wisdomPosts,
    cuisines: seed.cuisines,
    restaurants: seed.restaurants,
  };
}

async function writeCollection(db, collectionName, rows, summary) {
  for (const row of rows) {
    await db.collection(collectionName).doc(row.id).set(row.data, { merge: true });
    summary.writes += 1;
  }
  summary.byCollection[collectionName] = rows.length;
}

async function writeMessages(db, messages, summary) {
  const grouped = new Map();
  messages.forEach((message) => {
    if (!grouped.has(message.chatId)) {
      grouped.set(message.chatId, []);
    }
    grouped.get(message.chatId).push(message);
  });

  for (const [chatId, rows] of grouped.entries()) {
    for (const row of rows) {
      await db.collection("chats").doc(chatId).collection("messages").doc(row.id).set(row.data, {
        merge: true,
      });
      summary.writes += 1;
    }
  }

  summary.byCollection["chats/{chatId}/messages"] = messages.length;
}

async function resetCollection(db, collectionName, rows, summary) {
  for (const row of rows) {
    await db.collection(collectionName).doc(row.id).delete();
    summary.deletes += 1;
  }
}

async function resetMessages(db, messages, summary) {
  for (const row of messages) {
    await db.collection("chats").doc(row.chatId).collection("messages").doc(row.id).delete();
    summary.deletes += 1;
  }
}

function printPlan(seed) {
  const map = collectionMap(seed);
  console.log("Seed plan:");
  Object.entries(map).forEach(([name, rows]) => {
    console.log("- " + name + ": " + rows.length);
  });
  console.log("- chats/{chatId}/messages: " + seed.messages.length);
}

function printSummary(summary, mode) {
  console.log("");
  console.log("Seed " + mode + " complete.");
  Object.entries(summary.byCollection).forEach(([name, count]) => {
    console.log("- " + name + ": " + count);
  });
  console.log("total_writes: " + summary.writes);
  console.log("total_deletes: " + summary.deletes);
  console.log("");
  console.log("Validation checklist:");
  console.log("- Open Home, Discover, Events, Messages, Notifications.");
  console.log("- Confirm Wisdom Board and Food/Culture have non-empty backend rows.");
  console.log("- Confirm notification badge count reflects notifications collection.");
  console.log("- Confirm chat threads open and message history renders.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const seed = buildSeedData(new Date());
  const summary = {
    writes: 0,
    deletes: 0,
    byCollection: {},
  };

  printPlan(seed);
  if (args.dryRun) {
    console.log("");
    console.log("Dry run only. No writes executed.");
    return;
  }

  const db = initAdmin();
  const map = collectionMap(seed);

  if (args.reset) {
    for (const [collectionName, rows] of Object.entries(map)) {
      await resetCollection(db, collectionName, rows, summary);
    }
    await resetMessages(db, seed.messages, summary);
    console.log("Reset completed. Writing fresh seed data...");
  }

  const writeOrder = [
    "users",
    "communities",
    "events",
    "chats",
    "posts",
    "community_memberships",
    "event_attendees",
    "notifications",
    "wisdom_posts",
    "cuisines",
    "restaurants",
  ];

  for (const collectionName of writeOrder) {
    await writeCollection(db, collectionName, map[collectionName], summary);
  }

  await writeMessages(db, seed.messages, summary);
  printSummary(summary, "write");
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});
