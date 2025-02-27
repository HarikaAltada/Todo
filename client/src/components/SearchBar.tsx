import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import "../styles/searchBar.css";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};
const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="search-filter-container">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input type="text" placeholder="Search Project"   value={searchQuery} className="search-input" 
          onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>
        <button className="filter-btn">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <span>Filter</span>
        </button>
      </div>
    );
};

export default SearchBar;
