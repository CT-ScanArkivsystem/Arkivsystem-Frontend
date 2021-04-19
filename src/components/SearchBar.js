import React, {useState} from 'react';
import "./SearchBar.css";

export default function SearchBar() {
    const [keyword, setKeyword] = useState("");
    return (
        <input
            className="searchBar"
            type="search"
            value={keyword}
            placeholder={"Search"}
            onChange={(e) => setKeyword(e.target.value)}
        />
    );
}
