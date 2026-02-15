const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <label className="sr-only" htmlFor="search">
        Search bookmarks
      </label>
      <input
        id="search"
        className="search-input"
        type="text"
        placeholder="Search by title or URL..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;
