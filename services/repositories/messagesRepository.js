import {
  createChatMessage,
  getChatMessages,
  getCollectionDocuments,
} from "../firebase/firestoreService";
import {
  listCacheRecords,
  listThreadMessageRecords,
  upsertCacheRecord,
  upsertThreadMessageRecord,
} from "../localdb/cacheRepository";
import { isOnline } from "../network/connectivityService";
import { queueOrProcessWrite } from "../sync/outboxSyncService";

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "messages_error",
      message: error?.message || "Unexpected messages error",
    },
  };
}

function ok(data) {
  return { ok: true, data, error: null };
}

export async function fetchThreads(userId, limitCount = 100) {
  if (!userId) {
    return fail({ code: "missing_user_id", message: "userId is required" });
  }

  const remoteResult = await getCollectionDocuments("chats", {
    filters: [{ field: "participants", operator: "array-contains", value: userId }],
    orderByField: "lastMessageAt",
    orderDirection: "desc",
    maxResults: limitCount,
  });

  if (!remoteResult.ok) {
    return remoteResult;
  }

  remoteResult.data.forEach((item) => {
    if (item.id) {
      upsertCacheRecord("threads_cache", item.id, item);
    }
  });

  return remoteResult;
}

export function loadCachedThreads(limitCount = 100) {
  return listCacheRecords("threads_cache", limitCount);
}

export async function fetchMessages(chatId, limitCount = 100) {
  const online = await isOnline();
  if (!online) {
    return loadCachedMessages(chatId, limitCount);
  }

  const remoteResult = await getChatMessages(chatId, limitCount);

  if (!remoteResult.ok) {
    return loadCachedMessages(chatId, limitCount);
  }

  remoteResult.data.forEach((item) => {
    const messageId = item.id || item._id;
    if (messageId) {
      upsertThreadMessageRecord(messageId, chatId, item);
    }
  });

  return remoteResult;
}

export function loadCachedMessages(chatId, limitCount = 200) {
  const result = listThreadMessageRecords(chatId, limitCount);
  if (!result.ok) {
    return result;
  }

  return ok(result.data.map((item) => ({ id: item.id, _id: item.id, ...item.payload })));
}

export async function sendTextMessage({ chatId, senderId, text }) {
  if (!chatId || !senderId || !text) {
    return fail({
      code: "missing_message_fields",
      message: "chatId, senderId, and text are required",
    });
  }

  const localMessageId = "local-" + Date.now() + "-" + Math.round(Math.random() * 100000);
  const localPayload = {
    id: localMessageId,
    _id: localMessageId,
    senderId,
    type: "text",
    text,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const localSaveResult = upsertThreadMessageRecord(localMessageId, chatId, localPayload);
  if (!localSaveResult.ok) {
    return localSaveResult;
  }

  const queueResult = await queueOrProcessWrite(
    {
      entityType: "chat_messages",
      operation: "send",
      payload: { chatId, senderId, text, localMessageId },
    },
    {
      "chat_messages:send": async (item) => {
        const payload = item?.payload || {};
        const remoteResult = await createChatMessage(payload.chatId, {
          senderId: payload.senderId,
          type: "text",
          text: payload.text,
          status: "sent",
        });
        if (!remoteResult.ok) {
          throw new Error(remoteResult.error?.message || "Unable to sync message");
        }

        upsertThreadMessageRecord(payload.localMessageId, payload.chatId, {
          ...localPayload,
          status: "sent",
        });
        return true;
      },
    }
  );

  if (!queueResult.ok) {
    return queueResult;
  }

  return ok({
    localMessageId,
    queued: true,
    synced: Boolean(queueResult.data?.synced),
  });
}
