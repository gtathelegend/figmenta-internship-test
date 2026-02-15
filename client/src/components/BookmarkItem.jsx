import { useState } from "react";
import { formatApiError } from "../services/api.js";

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.host);
  } catch {
    return false;
  }
};

const normalizeTags = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
};

const BookmarkItem = ({ bookmark, onUpdate, onDelete, onTagClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    url: bookmark.url,
    title: bookmark.title,
    description: bookmark.description || "",
    tags: bookmark.tags?.join(", ") || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.url.trim() || !form.title.trim()) {
      setError("URL and title are required.");
      return;
    }

    if (!isValidUrl(form.url.trim())) {
      setError("Please enter a valid URL with protocol.");
      return;
    }

    const tagsArray = normalizeTags(form.tags);
    if (tagsArray.length > 5) {
      setError("Please limit tags to 5 or fewer.");
      return;
    }

    setIsSubmitting(true);
    const result = await onUpdate(bookmark.id, {
      url: form.url.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      tags: tagsArray,
    });

    if (!result.ok) {
      setError(formatApiError(result.error));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description || "",
      tags: bookmark.tags?.join(", ") || "",
    });
    setError("");
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete bookmark \"${bookmark.title}\"?`
    );
    if (confirmed) {
      onDelete(bookmark.id);
    }
  };

  if (isEditing) {
    return (
      <div className="card bookmark-item">
        <h3>Edit Bookmark</h3>
        {error ? <div className="notice">{error}</div> : null}
        <div className="inline-form">
          <input
            type="url"
            value={form.url}
            onChange={handleChange("url")}
            placeholder="https://example.com"
          />
          <input
            type="text"
            value={form.title}
            onChange={handleChange("title")}
            maxLength={200}
          />
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            maxLength={500}
          />
          <input
            type="text"
            value={form.tags}
            onChange={handleChange("tags")}
            placeholder="tags"
          />
        </div>
        <div className="button-row">
          <button className="primary" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button className="secondary" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bookmark-item">
      <h3>{bookmark.title}</h3>
      <div className="bookmark-meta">
        <a href={bookmark.url} target="_blank" rel="noreferrer">
          {bookmark.url}
        </a>
      </div>
      <p>{bookmark.description || "No description provided."}</p>
      <div className="tag-list">
        {(bookmark.tags || []).length === 0 ? (
          <span className="bookmark-meta">No tags</span>
        ) : (
          bookmark.tags.map((tag) => (
            <button
              key={tag}
              className="tag"
              onClick={() => onTagClick(tag)}
              type="button"
            >
              #{tag}
            </button>
          ))
        )}
      </div>
      <div className="button-row">
        <button className="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookmarkItem;
