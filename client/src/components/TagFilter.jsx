const TagFilter = ({ activeTag, onClear }) => {
  return (
    <div className="card filter-bar">
      {activeTag ? (
        <>
          <span className="tag active">#{activeTag}</span>
          <button className="secondary" onClick={onClear}>
            Clear tag filter
          </button>
        </>
      ) : (
        <span className="bookmark-meta">Click a tag to filter</span>
      )}
    </div>
  );
};

export default TagFilter;
