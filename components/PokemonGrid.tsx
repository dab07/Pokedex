import React, { useRef, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import '../css/PokemonGrid.css';
import {Link} from "react-router-dom";

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

type PokemonGridProps = {
    pokemonList: Pokemon[];
    isLoading: boolean;
    onLoadMore: () => void;
};

function PokemonGrid({ pokemonList, isLoading, onLoadMore}: PokemonGridProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastPokemonRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        console.log(`PokemonGrid received ${pokemonList.length} Pokémon`);

        // Log a few of them to verify
        if (pokemonList.length > 0) {
            console.log("First Pokémon:", pokemonList[0].name);
            console.log("Last Pokémon:", pokemonList[pokemonList.length - 1].name);
        }
    }, [pokemonList]);

    useEffect(() => {
        // Disconnect previous observer if exists
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create a new observer
        observerRef.current = new IntersectionObserver(entries => {
            // If the last Pokemon is visible and we're not currently loading
            if (entries[0].isIntersecting && !isLoading) {
                console.log("Last Pokémon visible, triggering load more");
                onLoadMore();
            }
        }, { threshold: 0.1 });

        // Observe the last Pokemon element
        // Inside PokemonGrid.tsx's useEffect
        if (lastPokemonRef.current) {
            console.log("Observing last Pokémon element");
            observerRef.current.observe(lastPokemonRef.current);
        } else {
            console.log("Last Pokémon ref is null");
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isLoading, onLoadMore, pokemonList.length]);

    return (
        <div className="pokemon-grid">
            {pokemonList.map((pokemon) => (
                <Link
                    to={`../pokemon/${pokemon.id}`}
                    key={pokemon.id}
                    className="pokemon-card-link"
                >
                    <div className="pokemon-card">
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="pokemon-image"
                        />
                        <div className="pokemon-info">
                            <span className="pokemon-id">#{pokemon.id}</span>
                            <h3>{pokemon.name}</h3>
                            <div className="pokemon-types">
                                {pokemon.types.map(typeInfo => (
                                    <span
                                        key={typeInfo.type.name}
                                        className={`type-badge ${typeInfo.type.name}`}
                                    >
                                        {typeInfo.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            {pokemonList.map((pokemon, index) => {
                // Apply the ref to the last Pokémon in the list
                if (index === pokemonList.length - 1) {
                    return (
                        <div
                            key={pokemon.id}
                            className="pokemon-card pokemon-card-last" // Add a special class
                            ref={lastPokemonRef}
                        >
                            <PokemonCard pokemon={pokemon} />
                            <div style={{position: 'absolute', bottom: 0, right: 0, background: 'red', color: 'white', padding: '2px'}}>
                                Last - #{pokemon.id}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div key={`${pokemon.id}-${index}`} className="pokemon-card-container">
                            <PokemonCard pokemon={pokemon} />
                            <div style={{fontSize: '10px', color: 'gray'}}>{index+1} of {pokemonList.length}</div>
                        </div>
                    );
                }
            })}
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '10px', background: '#f0f0f0'}}>
                Total Pokémon loaded: {pokemonList.length}
            </div>
        </div>
    );
}

export default PokemonGrid;
