// PokemonDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/PokemonDetail.css';

type Pokemon = {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other?: {
            'official-artwork'?: {
                front_default: string;
            }
        }
    };
    types: Array<{
        type: {
            name: string;
        }
    }>;
    height: number;
    weight: number;
    abilities: Array<{
        ability: {
            name: string;
        },
        is_hidden: boolean;
    }>;
    stats: Array<{
        base_stat: number;
        stat: {
            name: string;
        }
    }>;
};

type Evolution = {
    name: string;
    image : string;
}

function PokemonDetail() {
    const { id } = useParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [evolutionChain, setEvolutionChain] = useState<Evolution[]>([]);
    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch Pokémon #${id}`);
                }
                const data = await response.json();
                setPokemon(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching Pokémon details:', err);
                setError('Failed to load Pokémon details. Please try again later.');
                setPokemon(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPokemonDetails();
        }
    }, [id]);

    if (isLoading) {
        return <div className="loading-indicator">Loading Pokémon details...</div>;
    }

    if (error || !pokemon) {
        return (
            <div className="error-container">
                <p>{error || 'Pokémon not found'}</p>
                <Link to="/" className="back-button">Back to Pokédex</Link>
            </div>
        );
    }

    // Get the official artwork if available, otherwise use the default sprite
    const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;


    const getPokemonEvolution = async () => {
        try {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!pokemonResponse.ok) {
                throw new Error(`Failed to fetch Pokémon #${id}`);
            }
            const pokemonResponseData = await pokemonResponse.json();
            const evolutionResponse = await fetch(pokemonResponseData.evolution_chain.url);
            if (!evolutionResponse.ok) {
                console.error("Failed to fetch Pokemon Evolution")
            }
            const evolutionResponseData = await evolutionResponse.json();

            const evolution : Evolution[] = [];
            let initRevolution = evolutionResponseData.chain;

            while (initRevolution) {
                const name = initRevolution.species.name;
                const imageResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const imageData = await imageResponse.json();

                initRevolution = initRevolution.evolves_to.length > 0 ? initRevolution.evolves_to[0] : null;
            }
            setEvolutionChain(evolution);
        } catch (e) {
            console.error('Error fetching Pokwmon Evolution:', e);
        }
    }
    return (
        <div className="pokemon-detail-page">
            <Link to="/" className="back-button">← Back to Pokedex</Link>

            <div className="pokemon-detail-card">
                <div className="pokemon-detail-header">
                    <div className="pokemon-id">#{pokemon.id}</div>
                    <h1 className="pokemon-name">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </h1>

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

                <div className="pokemon-image-container">
                    <img
                        src={pokemonImage}
                        alt={pokemon.name}
                        className="pokemon-detail-image"
                    />
                </div>

                <div className="pokemon-info-sections">
                    <section className="pokemon-physical">
                        <h2>Physical</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Height</span>
                                <span className="info-value">{pokemon.height / 10} m</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Weight</span>
                                <span className="info-value">{pokemon.weight / 10} kg</span>
                            </div>
                        </div>
                    </section>

                    <section className="pokemon-abilities">
                        <h2>Abilities</h2>
                        <ul className="abilities-list">
                            {pokemon.abilities.map((abilityInfo, index) => (
                                <li key={index}>
                                    {abilityInfo.ability.name.replace('-', ' ')}
                                    {abilityInfo.is_hidden && <span className="hidden-ability"> (Hidden)</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="pokemon-stats">
                        <h2>Base Stats</h2>
                        <div className="stats-grid">
                            {pokemon.stats.map((statInfo, index) => (
                                <div key={index} className="stat-item">
                                    <span className="stat-label">
                                        {statInfo.stat.name.replace('-', ' ')}
                                    </span>
                                    <div className="stat-bar-container">
                                        <div
                                            className="stat-bar"
                                            style={{ width: `${Math.min(100, (statInfo.base_stat / 255) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{statInfo.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {evolutionChain.length > 1 && (
                        <section className="pokemon-evolution">
                            <h2>Evolution Chain</h2>
                            <div className="evolution-container">
                                {evolutionChain.map((stage, index) => (
                                    <div key={index} className="evolution-stage">
                                        <img src={stage.image} alt={stage.name} className="evolution-image" />
                                        <p className="evolution-name">
                                            {stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PokemonDetail;
