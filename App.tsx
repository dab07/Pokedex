import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PokemonGrid from './components/PokemonGrid';
import './css/App.css';
import PokemonDetail from "./components/PokemonDetail";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

type Pokemon = {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: Array<{
        type: {
            name: string;
        }
    }>;
    forms: Array<any>;
}

type PokemonBasicInfo = {
    id: number;
    name: string;
    url: string;
};

type PokemonDetailProps = {
    pokemon: Pokemon | null;
};

function App() {
    const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
    const [allPokemonBasicInfo, setAllPokemonBasicInfo] = useState<PokemonBasicInfo[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const POKEMON_PER_PAGE = 20;

    // Load all basic Pokémon info for searching
    useEffect(() => {
        const fetchAllBasicInfo = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
                const data = await response.json();

                const processedData = data.results.map((pokemon: any) => {
                    const id = parseInt(pokemon.url.split('/').filter(Boolean).pop());
                    return {
                        id,
                        name: pokemon.name,
                        url: pokemon.url
                    };
                });

                setAllPokemonBasicInfo(processedData);
            } catch (error) {
                console.error('Error fetching all Pokémon info:', error);
            }
        };

        fetchAllBasicInfo();
    }, []);

    // Load specific page of Pokemon
    const loadPokemonPage = async (page : number) => {
        if (isLoading) return;

        // console.log(`Starting to load page ${page}`);
        setIsLoading(true);

        try {
            const startId = (page - 1) * POKEMON_PER_PAGE + 1;
            const endId = page * POKEMON_PER_PAGE;

            // console.log(`Loading Pokémon from ID ${startId} to ${endId}`);

            const newPokemonBatch : Pokemon[] = [];
            for (let i = startId; i <= endId; i++) {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                    if (!response.ok) {
                        console.error(`Failed to fetch Pokémon #${i}: ${response.status}`);
                        continue;
                    }
                    const data = await response.json();
                    // console.log(`Fetched Pokémon #${i}: ${data.name}`);
                    newPokemonBatch.push(data);
                } catch (error) {
                    console.error(`Error fetching Pokémon #${i}:`, error);
                }
            }

            // console.log(`Successfully loaded ${newPokemonBatch.length} new Pokémon for page ${page}`);

            // Correctly append to the existing array without replacing it
            setDisplayedPokemon(prevPokemon => [...prevPokemon, ...newPokemonBatch]);

            setCurrentPage(page + 1);
        } catch (error) {
            console.error('Error loading Pokémon:', error);
        } finally {
            setIsLoading(false);
            console.log("Finished loading page");
        }
    };

    // Initial load
    useEffect(() => {
        if (!isSearching && displayedPokemon.length === 0) {
            loadPokemonPage(1);
        }
    }, []); // Runs only on mount, not when state changes

    const handleLoadMore = () => {
        // console.log("handleLoadMore called, isLoading:", isLoading, "isSearching:", isSearching);
        if (!isLoading && !isSearching) {
            loadPokemonPage(currentPage);
        }
    };
    // Search functionality
    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            // If already in normal mode, do nothing
            if (!isSearching) return;
            setIsSearching(false);
            setDisplayedPokemon([]); // Clear previous results
            setCurrentPage(1);
            loadPokemonPage(1); // Fetch only once
            return;
        }

        setIsSearching(true);
        setIsLoading(true);

        try {
            const matchingPokemon = allPokemonBasicInfo.filter(pokemon =>
                pokemon.name.includes(searchTerm.toLowerCase()) ||
                pokemon.id.toString().includes(searchTerm)
            );

            if (matchingPokemon.length === 0) {
                setDisplayedPokemon([]);
                return;
            }

            const toFetch = matchingPokemon.slice(0, 50);

            const newPokemonData = await Promise.all(
                toFetch.map(async (pokemon) => {
                    try {
                        const response = await fetch(pokemon.url);
                        if (!response.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
                        return await response.json();
                    } catch (error) {
                        console.error(`Error fetching ${pokemon.name}:`, error);
                        return null;
                    }
                })
            );

            const validPokemon = newPokemonData.filter(p => p !== null);
            validPokemon.sort((a, b) => a.id - b.id);

            setDisplayedPokemon(validPokemon);
        } catch (error) {
            console.error('Error performing search:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BrowserRouter>
            <div className="app">
                <header className="app-header">
                    <h1>Pokédex</h1>
                    <SearchBar onSearch={handleSearch} />
                </header>

                <main>
                    <Routes>
                        <Route path="/" element={
                            <PokemonGrid
                                pokemonList={displayedPokemon}
                                isLoading={isLoading}
                                onLoadMore={handleLoadMore}
                            />
                        } />
                        <Route path="/pokemon/:id" element={<PokemonDetail />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>

                    {isLoading && (
                        <div className="loading-indicator">Loading Pokémon...</div>
                    )}

                    {!isLoading && displayedPokemon.length === 0 && (
                        <div className="no-results">No Pokémon found</div>
                    )}
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
