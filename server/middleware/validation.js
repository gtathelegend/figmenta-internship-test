const { body, validationResult } = require("express-validator");

const tagsValidator = body("tags")
  .optional({ nullable: true })
  .isArray({ max: 5 })
  .withMessage("Tags must be an array with up to 5 items")
  .custom((tags) => {
    if (!Array.isArray(tags)) {
      return false;
    }

    return tags.every((tag) => {
      if (typeof tag !== "string") {
        return false;
      }

      const trimmed = tag.trim();
      return trimmed.length > 0 && trimmed === trimmed.toLowerCase();
    });
  })
  .withMessage("Tags must be lowercase strings");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  return next();
};

const validateBookmark = [
  body("url")
    .exists({ checkFalsy: true })
    .withMessage("URL is required")
    .bail()
    .isURL({ require_protocol: true })
    .withMessage("URL must be valid"),
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Title must be 200 characters or fewer"),
  body("description")
    .optional({ nullable: true, checkFalsy: false })
    .isLength({ max: 500 })
    .withMessage("Description must be 500 characters or fewer"),
  tagsValidator,
  validate,
];

const validateBookmarkUpdate = [...validateBookmark];

module.exports = {
  validateBookmark,
  validateBookmarkUpdate,
};
