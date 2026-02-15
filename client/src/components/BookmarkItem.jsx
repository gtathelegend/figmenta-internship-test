import { useState } from "react";
import EditBookmarkModal from "./EditBookmarkModal.jsx";

const BookmarkItem = ({ bookmark, onUpdate, onDelete, onTagClick }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete bookmark \"${bookmark.title}\"?`
    );
    if (confirmed) {
      onDelete(bookmark.id);
    }
  };

  const descriptionText = bookmark.description || "No description provided.";
  const snippet =
    descriptionText.length > 140
      ? `${descriptionText.slice(0, 140)}...`
      : descriptionText;

  return (
    <>
      <div className="card bookmark-item">
        <h3>{bookmark.title}</h3>
        <div className="bookmark-meta">
          <a href={bookmark.url} target="_blank" rel="noreferrer">
            {bookmark.url}
          </a>
        </div>
        <p>{snippet}</p>
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
      <EditBookmarkModal
        isOpen={isEditing}
        bookmark={bookmark}
        onSave={onUpdate}
        onClose={() => setIsEditing(false)}
      />
    </>
  );
};

export default BookmarkItem;
