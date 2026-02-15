const express = require("express");
const cors = require("cors");

const bookmarkRoutes = require("./routes/bookmarks");
const { initStore } = require("./data/bookmarksStore");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/bookmarks", bookmarkRoutes);

app.use(notFound);
app.use(errorHandler);

initStore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize data store", error);
    process.exit(1);
  });
