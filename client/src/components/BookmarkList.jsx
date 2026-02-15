import BookmarkItem from "./BookmarkItem.jsx";

const BookmarkList = ({ bookmarks, onUpdate, onDelete, onTagClick }) => {
  if (bookmarks.length === 0) {
    return <div className="card">No bookmarks to display.</div>;
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
