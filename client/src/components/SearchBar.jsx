const SearchBar = ({ value, onChange }) => {
  return (
    <div className="card">
      <input
        className="filter-input"
        type="text"
        placeholder="Search by title or URL..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;
