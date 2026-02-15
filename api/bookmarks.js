const {
  initStore,
  listBookmarks,
  createBookmark,
  updateBookmark,
  removeBookmark,
} = require("../server/data/bookmarksStore");

let initialized = false;

const ensureInit = async () => {
  if (!initialized) {
    await initStore();
    initialized = true;
  }
};

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  if (req.body) {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
};

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.host);
  } catch {
    return false;
  }
};

const validateBookmark = (payload) => {
  const errors = [];
  const url = payload?.url ? String(payload.url).trim() : "";
  const title = payload?.title ? String(payload.title).trim() : "";
  const description = payload?.description
    ? String(payload.description)
    : "";
  const tags = payload?.tags;

  if (!url) {
    errors.push({ field: "url", message: "URL is required" });
  } else if (!isValidUrl(url)) {
    errors.push({ field: "url", message: "URL must be valid" });
  }

  if (!title) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be 200 characters or fewer",
    });
  }

  if (description && description.length > 500) {
    errors.push({
      field: "description",
      message: "Description must be 500 characters or fewer",
    });
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push({
        field: "tags",
        message: "Tags must be an array with up to 5 items",
      });
    } else {
      if (tags.length > 5) {
        errors.push({
          field: "tags",
          message: "Tags must be an array with up to 5 items",
        });
      }

      const invalid = tags.find((tag) => {
        if (typeof tag !== "string") {
          return true;
        }

        const trimmed = tag.trim();
        return trimmed.length === 0 || trimmed !== trimmed.toLowerCase();
      });

      if (invalid !== undefined) {
        errors.push({
          field: "tags",
          message: "Tags must be lowercase strings",
        });
      }
    }
  }

  return errors;
};

module.exports = async (req, res) => {
  await ensureInit();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const id = pathParts.length > 2 ? pathParts[2] : null;

  try {
    if (req.method === "GET") {
      const tag = url.searchParams.get("tag");
      const bookmarks = listBookmarks(tag ? tag.toLowerCase() : null);
      return sendJson(res, 200, bookmarks);
    }

    if (req.method === "POST") {
      const body = await parseBody(req);
      const errors = validateBookmark(body);
      if (errors.length > 0) {
        return sendJson(res, 400, { error: "Validation failed", details: errors });
      }

      const bookmark = await createBookmark(body);
      return sendJson(res, 201, bookmark);
    }

    if (req.method === "PUT") {
      if (!id) {
        return sendJson(res, 404, { error: "Bookmark not found" });
      }

      const body = await parseBody(req);
      const errors = validateBookmark(body);
      if (errors.length > 0) {
        return sendJson(res, 400, { error: "Validation failed", details: errors });
      }

      const updated = await updateBookmark(id, body);
      if (!updated) {
        return sendJson(res, 404, { error: "Bookmark not found" });
      }

      return sendJson(res, 200, updated);
    }

    if (req.method === "DELETE") {
      if (!id) {
        return sendJson(res, 404, { error: "Bookmark not found" });
      }

      const deleted = await removeBookmark(id);
      if (!deleted) {
        return sendJson(res, 404, { error: "Bookmark not found" });
      }

      return sendJson(res, 200, { message: "Bookmark deleted", bookmark: deleted });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, { error: "Internal server error" });
  }
};
