const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const dataFile = path.join(__dirname, "bookmarks.json");
let bookmarks = [];

const seedBookmarks = [
  {
    id: "seed-1",
    url: "https://developer.mozilla.org/",
    title: "MDN Web Docs",
    description: "Reference and tutorials for web developers.",
    tags: ["docs", "web", "javascript"],
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "seed-2",
    url: "https://react.dev/",
    title: "React",
    description: "Official React documentation and guides.",
    tags: ["react", "frontend"],
    createdAt: "2026-02-02T10:00:00.000Z",
  },
  {
    id: "seed-3",
    url: "https://expressjs.com/",
    title: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js.",
    tags: ["node", "backend", "express"],
    createdAt: "2026-02-03T10:00:00.000Z",
  },
  {
    id: "seed-4",
    url: "https://vitejs.dev/",
    title: "Vite",
    description: "Next generation frontend tooling.",
    tags: ["tooling", "frontend"],
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "seed-5",
    url: "https://developer.chrome.com/docs/",
    title: "Chrome Developers",
    description: "Guides and tools for building on the web.",
    tags: ["docs", "web"],
    createdAt: "2026-02-05T10:00:00.000Z",
  },
];

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag).trim().toLowerCase())
    .filter((tag) => tag.length > 0)
    .slice(0, 5);
};

const normalizeBookmarkData = (data) => ({
  url: String(data.url || "").trim(),
  title: String(data.title || "").trim(),
  description: data.description ? String(data.description).trim() : "",
  tags: normalizeTags(data.tags),
});

const saveToFile = async () => {
  await fs.writeFile(dataFile, JSON.stringify(bookmarks, null, 2), "utf-8");
};

const seedIfNeeded = async () => {
  if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
    bookmarks = seedBookmarks;
    await saveToFile();
  }
};

const initStore = async () => {
  try {
    const fileContent = await fs.readFile(dataFile, "utf-8");
    const parsed = JSON.parse(fileContent);
    bookmarks = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
    bookmarks = [];
  }

  await seedIfNeeded();
};

const listBookmarks = (tag) => {
  if (!tag) {
    return bookmarks;
  }

  const normalizedTag = tag.toLowerCase();
  return bookmarks.filter((bookmark) =>
    bookmark.tags?.includes(normalizedTag)
  );
};

const createBookmark = async (data) => {
  const normalized = normalizeBookmarkData(data);
  const bookmark = {
    id: randomUUID(),
    url: normalized.url,
    title: normalized.title,
    description: normalized.description,
    tags: normalized.tags,
    createdAt: new Date().toISOString(),
  };

  bookmarks.push(bookmark);
  await saveToFile();
  return bookmark;
};

const updateBookmark = async (id, data) => {
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);
  if (index === -1) {
    return null;
  }

  const normalized = normalizeBookmarkData(data);
  const updated = {
    ...bookmarks[index],
    url: normalized.url,
    title: normalized.title,
    description: normalized.description,
    tags: normalized.tags,
  };

  bookmarks[index] = updated;
  await saveToFile();
  return updated;
};

const removeBookmark = async (id) => {
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);
  if (index === -1) {
    return null;
  }

  const [removed] = bookmarks.splice(index, 1);
  await saveToFile();
  return removed;
};

module.exports = {
  initStore,
  listBookmarks,
  createBookmark,
  updateBookmark,
  removeBookmark,
};
