const FilterBar = ({ searchTerm, onSearchChange, activeTag, onClearTag }) => {
  return (
    <div className="filter-bar card">
      <input
        className="filter-input"
        type="text"
        placeholder="Search by title or URL..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      {activeTag ? (
        <div className="button-row">
          <span className="tag active">#{activeTag}</span>
          <button className="secondary" onClick={onClearTag}>
            Clear tag filter
          </button>
        </div>
      ) : (
        <span className="bookmark-meta">Click a tag to filter</span>
      )}
    </div>
  );
};

export default FilterBar;
