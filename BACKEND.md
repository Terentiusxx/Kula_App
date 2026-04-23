# KULA App — Backend Integration Guide

This document is for the backend developer connecting the API to this React Native (Expo) frontend.

---

## 1. Quick Start — What to Configure

There is **one file** to configure to point the app at your server:

**`constants/server.js`**

```js
export const BASE_URL = "http://YOUR_SERVER_IP:YOUR_PORT/";
```

Change `BASE_URL` to your deployed or local server URL. All API calls are built using the `ENDPOINTS` map in the same file.

---

## 2. Authentication Flow

The app uses a simple JWT-based auth flow.

| Flow Step | File | What to implement |
|---|---|---|
| Login / Signup | `store/auth-context.js` | `authenticate()` — call `POST /auth/login`, store JWT (AsyncStorage or SecureStore) |
| Logout | `store/auth-context.js` | `logout()` — clear JWT, call `POST /auth/logout` |
| Update Profile | `store/auth-context.js` | `updateUserData()` — call `PATCH /users/:id` |
| Protected Requests | All API calls | Attach `Authorization: Bearer <token>` header |

> The app currently runs in **mock mode** — any email/password logs in with a fake user. Swap the `authenticate()` body with a real fetch once the backend is live.

---

## 3. Data Schemas

These are the object shapes the frontend expects. Match these fields in your API responses.

### User
```json
{
  "_id": "string",
  "fullName": "string",
  "username": "string",
  "email": "string",
  "bio": "string",
  "occupation": "string",
  "picturePath": "string (URL)",
  "originCountry": "string",
  "originFlag": "string (emoji)",
  "currentCity": "string",
  "arrivalYear": "number",
  "interests": ["string"],
  "communities": ["string"],
  "friends": ["userId"],
  "eventsAttended": "number",
  "createdAt": "ISO date string"
}
```

### Post
```json
{
  "_id": "string",
  "userId": "string",
  "userFullName": "string",
  "userPicturePath": "string (URL)",
  "userInitials": "string",
  "userAvatarColor": "string (hex)",
  "originFlag": "string (emoji)",
  "description": "string",
  "picturePath": "string (URL)",
  "fileType": "image | video",
  "likes": ["userId"],
  "comments": [{ "userId": "string", "text": "string" }],
  "community": "string",
  "createdAt": "ISO date string"
}
```

### Event
```json
{
  "_id": "string",
  "title": "string",
  "community": "string",
  "organiserId": "string",
  "organiserName": "string",
  "coverImage": "string (URL)",
  "date": "string (e.g. 'Apr 26')",
  "time": "string (e.g. '6:30 PM')",
  "location": "string",
  "attendees": ["userId"],
  "attendeeCount": "number",
  "socialProof": "string",
  "category": "string"
}
```

### Message Thread
```json
{
  "_id": "string",
  "contactId": "string",
  "contactName": "string",
  "contactInitials": "string",
  "contactColor": "string (hex)",
  "originFlag": "string (emoji)",
  "lastMessage": "string",
  "timestamp": "string",
  "unread": "number"
}
```

### Notification
```json
{
  "_id": "string",
  "mode": "LIKE | COMMENT | FOLLOW",
  "fromId": "string",
  "fromName": "string",
  "fromInitials": "string",
  "fromColor": "string (hex)",
  "fromPic": "string (URL)",
  "postImage": "string (URL) | null",
  "time": "string"
}
```

---

## 4. Mock Data → API Swap Points

Every place in the code that uses mock data has a comment like:

```js
// MOCK MODE: Using MOCK_POSTS — replace with API call to GET /posts/:userId when backend is ready
```

Search for `MOCK MODE` across the codebase to find all swap points:

```
store/auth-context.js         → login, logout, updateUser
screens/SearchScreen.js       → GET /users/search
components/home/body/Video.js → GET /posts (feed)
components/userProfileScreen/ProfileBody.js → GET /posts/:userId
```

All mock data lives in **`data/mockData.js`** — the data shapes there match the schemas above exactly.

---

## 5. Image Uploads

The app uses `expo-image-picker` to select images. When uploading:

- Send as `multipart/form-data`
- Field name: `picture`
- The backend should return the hosted URL as `picturePath` in the response

---

## 6. Tech Stack Reference

| Layer | Technology |
|---|---|
| Framework | React Native 0.74.5 |
| Build | Expo ~51 (Managed Workflow) |
| Navigation | React Navigation v6 |
| State | React Context API (`store/auth-context.js`, `store/app-context.js`) |
| HTTP | Native `fetch` API (no Axios) |
| Storage | `@react-native-async-storage/async-storage` |

---

## 7. Running the App

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (same WiFi network as dev machine).

---

## 8. Firestore Seed Script

A deterministic seed utility is included for quickly populating Firestore with linked sample data that matches app repository query shapes.

### Files

- `scripts/seed-firestore.js`
- `scripts/seed-data.js`

### Prerequisites

1. Download a Firebase service account JSON for the project.
2. Set an environment variable to that file path:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_PATH="C:\path\to\service-account.json"
```

### Commands

- Dry-run (prints counts only, no writes):

```bash
npm run seed:firestore:dry-run
```

- Seed write (idempotent upserts using deterministic IDs):

```bash
npm run seed:firestore
```

- Reset seeded docs then re-seed:

```bash
npm run seed:firestore:reset
```

### Seeded Collections (small scope)

- `users` (10)
- `posts` (20)
- `communities` (10)
- `community_memberships`
- `events` (10)
- `event_attendees`
- `notifications`
- `chats`
- `chats/{chatId}/messages`
- `wisdom_posts`
- `cuisines`
- `restaurants`

### Notes

- IDs use stable prefixes (for example `seed_user_01`), so re-running does not create duplicate growth.
- `--reset` only deletes deterministic seed IDs created by this script.
- The script prints a post-seed validation checklist for key app surfaces (Home, Discover, Events, Messages, Notifications, Wisdom, Food/Culture).

---

## 9. Message Notification Trigger (Cloud Functions)

Message notifications are backend-generated from Firestore writes.

### Source files

- `firebase-functions/index.js`
- `firebase-functions/package.json`

### What it does

- Watches `chats/{chatId}/messages/{messageId}` creations.
- Loads chat participants, skips the sender, and writes one notification per recipient into `notifications`.
- Creates notifications with `mode: "MESSAGE"` and `type: "MESSAGE"` so the mobile app can render them.
- Skips wave messages (`👋 Wave from ...`) to avoid duplicate notifications (wave notifications are already created client-side).

### Deploy (from project root)

```bash
cd firebase-functions
npm install
npx firebase deploy --only functions:notifyMessageRecipients
```
