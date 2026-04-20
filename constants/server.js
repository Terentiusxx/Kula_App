// ─── KULA API Configuration ───────────────────────────────────────────────────
// TODO (backend): Replace BASE_URL with your deployed server URL.
// During local development, use your machine's local IP (not localhost).
// Example: "http://192.168.1.XX:3001/" for same-network devices.

export const BASE_URL = "http://192.168.10.4:3001/";

// ─── API Endpoints ────────────────────────────────────────────────────────────
// All paths are relative to BASE_URL.
// Format: BASE_URL + ENDPOINTS.someEndpoint

export const ENDPOINTS = {
  // Auth
  login: "auth/login",         // POST   { email, password } → { token, user }
  register: "auth/register",   // POST   { fullName, username, email, password, ... } → { token, user }
  logout: "auth/logout",       // POST   (requires auth header)

  // Users
  getUser: "users/",           // GET    users/:id → user object
  updateUser: "users/",        // PATCH  users/:id { ...fields } → updated user
  searchUsers: "users/search", // GET    ?q=query → [users]
  getFriends: "users/friends", // GET    users/:id/friends → [users]

  // Posts
  getPosts: "posts/",          // GET    ?userId=:id or feed → [posts]
  createPost: "posts/",        // POST   multipart/form-data { description, file } → post
  likePost: "posts/like/",     // PATCH  posts/like/:id → updated likes

  // Events
  getEvents: "events/",        // GET    → [events]
  attendEvent: "events/attend/", // PATCH events/attend/:id → updated attendees

  // Messages
  getThreads: "messages/",     // GET    messages/:userId → [threads]
  getChat: "messages/chat/",   // GET    messages/chat/:contactId → [messages]
  sendMessage: "messages/",    // POST   { toId, text } → message

  // Notifications
  getNotifications: "notifications/", // GET notifications/:userId → [notifications]

  // Stories
  getStories: "stories/",      // GET    → [stories]
  createStory: "stories/",     // POST   multipart/form-data → story
};
