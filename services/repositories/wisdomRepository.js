import { getCollectionDocuments } from "../firebase/firestoreService";

function ok(data, source = "remote") {
  return { ok: true, data, error: null, source };
}

function fail(error) {
  return {
    ok: false,
    data: null,
    error: {
      code: error?.code || "wisdom_repository_error",
      message: error?.message || "Unexpected wisdom repository error",
    },
  };
}

function toTimeAgo(value) {
  if (!value) {
    return "now";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    const diffMs = Date.now() - date.getTime();
    const hours = Math.floor(diffMs / 3600000);
    if (hours < 1) return "now";
    if (hours < 24) return hours + "h ago";
    return Math.floor(hours / 24) + "d ago";
  }
  return "now";
}

function normalizeWisdomPost(item = {}, index = 0) {
  const id = item.id || item._id || "wisdom_" + index;
  const topAnswerText =
    item.topAnswer?.text || item.topAnswerText || item.answerPreview || "";

  return {
    _id: String(id),
    question: item.question || item.title || "Community question",
    authorName: item.authorName || item.askedBy || item.userName || "Community Member",
    authorPic:
      item.authorPic ||
      item.avatar ||
      item.picturePath ||
      "https://i.pravatar.cc/100?img=12",
    timeAgo: toTimeAgo(item.timeAgo || item.createdAt),
    category: item.category || item.tag || "General",
    likes: Number(item.likes || item.likeCount || 0),
    answerCount: Number(item.answerCount || item.answers || 0),
    topAnswer: topAnswerText
      ? {
          authorName:
            item.topAnswer?.authorName || item.topAnswerAuthorName || "Top Contributor",
          badge: item.topAnswer?.badge || item.topAnswerBadge || "Community Member",
          text: topAnswerText,
        }
      : null,
  };
}

export async function fetchWisdomPosts({ maxResults = 60 } = {}) {
  try {
    const result = await getCollectionDocuments("wisdom_posts", {
      maxResults,
      orderByField: "createdAt",
      orderDirection: "desc",
    });

    if (!result.ok) {
      return fail(result.error);
    }

    return ok((result.data || []).map(normalizeWisdomPost), "remote");
  } catch (error) {
    return fail(error);
  }
}

