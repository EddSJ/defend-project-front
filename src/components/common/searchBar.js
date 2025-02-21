import React from "react";

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="form-control"
      />
    </div>
  );
};

export default SearchBar;