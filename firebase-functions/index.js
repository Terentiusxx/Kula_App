"use strict";

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.notifyMessageRecipients = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      return;
    }

    const message = snapshot.data() || {};
    const chatId = event.params.chatId;
    const messageId = event.params.messageId;
    const senderId = String(message.senderId || "").trim();
    const messageText = String(message.text || "").trim();

    if (!chatId || !messageId || !senderId || !messageText) {
      logger.warn("Skipping notification: missing message fields", {
        chatId,
        messageId,
      });
      return;
    }

    // Wave messages already create a wave-style notification in app code.
    if (messageText.startsWith("👋 Wave from")) {
      return;
    }

    const chatDoc = await db.collection("chats").doc(chatId).get();
    if (!chatDoc.exists) {
      logger.warn("Skipping notification: chat doc missing", { chatId });
      return;
    }

    const chatData = chatDoc.data() || {};
    const participants = Array.isArray(chatData.participants) ? chatData.participants : [];
    const recipients = participants
      .map((id) => String(id || "").trim())
      .filter((id) => id && id !== senderId);

    if (recipients.length === 0) {
      return;
    }

    let senderName = String(message.senderName || "").trim();
    let senderAvatar = String(message.senderAvatar || "").trim();
    if (!senderName || !senderAvatar) {
      const senderProfileDoc = await db.collection("users").doc(senderId).get();
      if (senderProfileDoc.exists) {
        const senderData = senderProfileDoc.data() || {};
        if (!senderName) {
          senderName = String(
            senderData.fullName || senderData.username || "Community member"
          ).trim();
        }
        if (!senderAvatar) {
          senderAvatar = String(senderData.picturePath || "").trim();
        }
      }
    }

    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();
    recipients.forEach((userId) => {
      const notificationId = "msg_" + chatId + "_" + messageId + "_" + userId;
      const ref = db.collection("notifications").doc(notificationId);
      batch.set(
        ref,
        {
          userId,
          mode: "MESSAGE",
          type: "MESSAGE",
          fromId: senderId,
          fromName: senderName || "Community member",
          fromPic: senderAvatar || "",
          actorId: senderId,
          actorName: senderName || "Community member",
          actorAvatar: senderAvatar || "",
          chatId,
          message: messageText,
          sourceMessageId: messageId,
          createdAt,
          updatedAt: createdAt,
        },
        { merge: true }
      );
    });

    await batch.commit();
  }
);
