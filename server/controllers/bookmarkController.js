const {
  listBookmarks,
  createBookmark,
  updateBookmark,
  removeBookmark,
} = require("../data/bookmarksStore");

const getBookmarks = (req, res, next) => {
  try {
    const tag = req.query.tag ? req.query.tag.toLowerCase() : null;
    const bookmarks = listBookmarks(tag);
    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

const createBookmarkHandler = async (req, res, next) => {
  try {
    const bookmark = await createBookmark(req.body);
    res.status(201).json(bookmark);
  } catch (error) {
    next(error);
  }
};

const updateBookmarkHandler = async (req, res, next) => {
  try {
    const updated = await updateBookmark(req.params.id, req.body);
    if (!updated) {
      const error = new Error("Bookmark not found");
      error.status = 404;
      throw error;
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteBookmarkHandler = async (req, res, next) => {
  try {
    const deleted = await removeBookmark(req.params.id);
    if (!deleted) {
      const error = new Error("Bookmark not found");
      error.status = 404;
      throw error;
    }
    res.json({ message: "Bookmark deleted", bookmark: deleted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookmarks,
  createBookmark: createBookmarkHandler,
  updateBookmark: updateBookmarkHandler,
  deleteBookmark: deleteBookmarkHandler,
};
