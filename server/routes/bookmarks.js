const express = require("express");

const {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} = require("../controllers/bookmarksController");
const {
  validateBookmark,
  validateBookmarkUpdate,
} = require("../middleware/validateBookmark");

const router = express.Router();

router.get("/", getBookmarks);
router.post("/", validateBookmark, createBookmark);
router.put("/:id", validateBookmarkUpdate, updateBookmark);
router.delete("/:id", deleteBookmark);

module.exports = router;
