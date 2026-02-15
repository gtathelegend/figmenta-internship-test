import { useEffect, useMemo, useState } from "react";
import {
  createBookmark,
  deleteBookmark,
  fetchBookmarks,
  updateBookmark,
} from "../services/api.js";
import BookmarkForm from "../components/BookmarkForm.jsx";
import BookmarkList from "../components/BookmarkList.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TagFilter from "../components/TagFilter.jsx";
import Loading from "../components/Loading.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const Home = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const loadBookmarks = async (tag = "") => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchBookmarks(tag);
      setBookmarks(data);
    } catch (err) {
      setError(err.message || "Failed to load bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks(activeTag);
  }, [activeTag]);

  const filteredBookmarks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return bookmarks;
    }

    return bookmarks.filter((bookmark) =>
      [bookmark.title, bookmark.url]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [bookmarks, searchTerm]);

  const handleCreate = async (payload) => {
    try {
      await createBookmark(payload);
      await loadBookmarks(activeTag);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateBookmark(id, payload);
      await loadBookmarks(activeTag);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteBookmark(id);
      await loadBookmarks(activeTag);
    } catch (err) {
      setError(err.message || "Failed to delete bookmark");
    }
  };

  return (
    <div className="app-main">
      <BookmarkForm onCreate={handleCreate} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <TagFilter activeTag={activeTag} onClear={() => setActiveTag("")} />
      {error ? <ErrorBanner message={error} /> : null}
      {isLoading ? (
        <Loading message="Loading bookmarks..." />
      ) : (
        <BookmarkList
          bookmarks={filteredBookmarks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onTagClick={(tag) => setActiveTag(tag)}
        />
      )}
    </div>
  );
};

export default Home;
