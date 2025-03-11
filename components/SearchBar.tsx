import React, { useState, useEffect, useCallback } from 'react';
import '../css/SearchBar.css';

type SearchBarProps = {
    onSearch: (term: string) => void;
};

function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Use debounce to prevent too many search calls
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            onSearch(term);
        }, 300),
        [onSearch]
    );

    // Effect for handling the search term changes
    useEffect(() => {
        debouncedSearch(searchTerm);

        // Cleanup function
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="Search Pokémon by name or number..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                {searchTerm && (
                    <button className="clear-button" onClick={handleClear}>
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<T>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };

    debounced.cancel = () => {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}

export default SearchBar;
