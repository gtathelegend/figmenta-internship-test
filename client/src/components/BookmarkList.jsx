import BookmarkItem from "./BookmarkItem.jsx";

const BookmarkList = ({ bookmarks, onUpdate, onDelete, onTagClick }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="card empty-state">
        <h3>No bookmarks yet</h3>
        <p>Add a new link to start building your library.</p>
      </div>
    );
  }

  return (
    <div className="bookmark-grid">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};

export default BookmarkList;
