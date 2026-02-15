const TagFilter = ({ activeTag, onClear }) => {
  return (
    <div className="card filter-card">
      <h3 className="section-title">Tag Filter</h3>
      {activeTag ? (
        <div className="filter-bar">
          <span className="tag active">#{activeTag}</span>
          <button className="secondary" onClick={onClear}>
            Clear tag filter
          </button>
        </div>
      ) : (
        <span className="bookmark-meta">Click a tag to filter</span>
      )}
    </div>
  );
};

export default TagFilter;
