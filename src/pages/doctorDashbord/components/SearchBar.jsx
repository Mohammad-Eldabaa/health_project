import { useState } from "react";
import "./SearchBar.css";
import SearchIcon from '@mui/icons-material/Search';


function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="search-bar">
            <SearchIcon className="search-icon" />
            <input
                className="search-input"
                type="text"
                placeholder={props.placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>

    );
}

export default SearchBar;