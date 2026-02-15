import { useEffect, useState } from "react";
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

const EditBookmarkModal = ({ isOpen, bookmark, onSave, onClose }) => {
  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!bookmark) {
      return;
    }

    setForm({
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description || "",
      tags: bookmark.tags?.join(", ") || "",
    });
    setError("");
  }, [bookmark]);

  if (!isOpen || !bookmark) {
    return null;
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    const result = await onSave(bookmark.id, {
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
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>Edit Bookmark</h3>
          <button className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
        {error ? <div className="notice">{error}</div> : null}
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label htmlFor="edit-url">URL</label>
              <input
                id="edit-url"
                type="url"
                value={form.url}
                onChange={handleChange("url")}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                maxLength={200}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                value={form.description}
                onChange={handleChange("description")}
                maxLength={500}
              />
            </div>
            <div>
              <label htmlFor="edit-tags">Tags (comma separated)</label>
              <input
                id="edit-tags"
                type="text"
                value={form.tags}
                onChange={handleChange("tags")}
              />
            </div>
          </div>
          <div className="button-row">
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookmarkModal;
