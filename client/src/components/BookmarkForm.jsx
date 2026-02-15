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

const BookmarkForm = ({ onCreate }) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!url.trim() || !title.trim()) {
      setError("URL and title are required.");
      return;
    }

    if (!isValidUrl(url.trim())) {
      setError("Please enter a valid URL with protocol.");
      return;
    }

    const tagsArray = normalizeTags(tags);
    if (tagsArray.length > 5) {
      setError("Please limit tags to 5 or fewer.");
      return;
    }

    setIsSubmitting(true);
    const result = await onCreate({
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      tags: tagsArray,
    });

    if (!result.ok) {
      setError(formatApiError(result.error));
      setIsSubmitting(false);
      return;
    }

    setUrl("");
    setTitle("");
    setDescription("");
    setTags("");
    setIsSubmitting(false);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="section-title">Add Bookmark</h2>
      {error ? <div className="notice">{error}</div> : null}
      <div className="form-grid">
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="react, docs"
          />
        </div>
      </div>
      <div className="button-row">
        <button className="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Bookmark"}
        </button>
      </div>
    </form>
  );
};

export default BookmarkForm;
