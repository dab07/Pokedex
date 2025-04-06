import React, { useState } from 'react';
import '../css/NavigationBar.css';

type NavigationBarProps = {
    onSearch: (searchTerm: string) => void;
    onSort: (sortMethod: string) => void;
}

const NavigationBar= ({ onSearch, onSort } : NavigationBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="navigation-bar">
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="filter-section">
                <select onChange={(e) => onSort(e.target.value)}>
                    <option value="">Sort by...</option>
                    <option value="a-z">Name (A to Z)</option>
                    <option value="z-a">Name (Z to A)</option>
                    <option value="id-asc">ID (Ascending)</option>
                    <option value="id-desc">ID (Descending)</option>
                </select>

                <button className="advanced-filter-btn">Advanced Filters</button>
                <button className="compare-btn">Compare</button>
            </div>
        </div>
    );
};

export default NavigationBar;
