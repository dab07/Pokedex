import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/ComparePokemon.css';

const PokemonCompare = () => {
    const [allPokemon, setAllPokemon] = useState<any[]>([]);
    const [pokemon1, setPokemon1] = useState<any>(null);
    const [pokemon2, setPokemon2] = useState<any>(null);
    const [pokemon1Name, setPokemon1Name] = useState<string>('');
    const [pokemon2Name, setPokemon2Name] = useState<string>('');
    const [weaknesses1, setWeaknesses1] = useState<string[]>([]);
    const [weaknesses2, setWeaknesses2] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const location = useLocation();

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
                const data = await response.json();
                setAllPokemon(data.results);

                const searchParams = new URLSearchParams(location.search);
                const queryString = location.search.slice(1);
                const pokemonQuery = queryString.toLowerCase().split('&').map(pq => pq.trim());

                if (pokemonQuery[0]) {
                    setPokemon1Name(pokemonQuery[0]);
                    fetchPokemon(pokemonQuery[0], setPokemon1, setWeaknesses1);
                }
                if (pokemonQuery[1]) {
                    setPokemon2Name(pokemonQuery[1]);
                    fetchPokemon(pokemonQuery[1], setPokemon2, setWeaknesses2);
                }

                if (location.state?.pokemonName && !pokemonQuery[0]) {
                    setPokemon1Name(location.state.pokemonName);
                    fetchPokemon(location.state.pokemonName, setPokemon1, setWeaknesses1);
                }

            } catch (error) {
                console.error("Error fetching Pokémon list:", error);
            }
        };

        fetchAllPokemon();
    }, []);

    const fetchPokemon = async (
        pokemonName: string,
        setPokemon: (data: any) => void,
        setWeaknesses: (data: string[]) => void
    ) => {
        if (!pokemonName) return;
        setIsLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();
            setPokemon(data);

            const types = data.types.map((typeObj: any) => typeObj.type.name);
            fetchWeaknesses(types, setWeaknesses);
        } catch (error) {
            console.error(`Error fetching ${pokemonName}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWeaknesses = async (types: string[], setWeaknesses: (data: string[]) => void) => {
        const weaknessSet = new Set<string>();

        for (const type of types) {
            const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const data = await res.json();
            data.damage_relations.double_damage_from.forEach((t: any) => weaknessSet.add(t.name));
        }

        setWeaknesses(Array.from(weaknessSet));
    };

    const handlePokemon1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setPokemon1Name(name);
        fetchPokemon(name, setPokemon1, setWeaknesses1);
    };

    const handlePokemon2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setPokemon2Name(name);
        fetchPokemon(name, setPokemon2, setWeaknesses2);
    };

    return (
        <div className="pokemon-detail-container">
            <h1 className="title">Compare Pokémon</h1>

            <div className="select-container">
                <select value={pokemon1Name} onChange={handlePokemon1Change}>
                    <option value="">Select Pokémon 1</option>
                    {allPokemon.map((pokemon) => (
                        <option key={pokemon.name} value={pokemon.name}>
                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </option>
                    ))}
                </select>

                <select value={pokemon2Name} onChange={handlePokemon2Change}>
                    <option value="">Select Pokémon 2</option>
                    {allPokemon.map((pokemon) => (
                        <option key={pokemon.name} value={pokemon.name}>
                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading && <p>Loading...</p>}

            <div className="compare-grid">
                {pokemon1 && (
                    <div className="pokemon-card1">
                        <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
                        <div className="pokemon-meta-line">
                            <span>Height: {pokemon1.height}</span>
                            <span>Weight: {pokemon1.weight}</span>
                            <span>Base Exp: {pokemon1.base_experience}</span>
                        </div>
                        <div className="pokemon-ability">
                            <h2>Abilities</h2>
                            <ul className="pokemon-ability-list">
                                {pokemon1.abilities.map((a: any) => (
                                    <li key={a.ability.name} className="ability-item">
                                        {a.ability.name}
                                        {a.is_hidden && <span className="hidden-ability">(Hidden)</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="pokemon-stat">
                            {pokemon1.stats.map((stat : any) => (
                                <li key={stat.stat.name} className="stat-item">
                                    <span className="stat-name">{stat.stat.name}</span>
                                    <div className="stat-bar-container">
                                        <div
                                            className="stat-bar"
                                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                        >
                                            <span className="stat-value">{stat.base_stat}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                        <div className="pokemon-lower-info">
                            <div className="pokemon-type">
                                <h2>Types</h2>
                                <ul className="pokemon-type-list">
                                    {pokemon1.types.map((typeObj: any) => (
                                        <li key={typeObj.type.name} className={`type-badge ${typeObj.type.name}`}>
                                            {typeObj.type.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pokemon-weakness">
                                <h2>Weaknesses</h2>
                                <ul className="pokemon-weakness-list">
                                    {weaknesses1.map((weakness, index) => (
                                        <li key={index} className={`weakness-badge ${weakness}`}>
                                            {weakness}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {pokemon2 && (
                    <div className="pokemon-card2">
                        <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
                        <div className="pokemon-meta-line">
                            <span>Height: {pokemon2.height}</span>
                            <span>Weight: {pokemon2.weight}</span>
                            <span>Base Exp: {pokemon2.base_experience}</span>
                        </div>
                        <div className="pokemon-ability">
                            <h2>Abilities</h2>
                            <ul className="pokemon-ability-list">
                                {pokemon2.abilities.map((a: any) => (
                                    <li key={a.ability.name} className="ability-item">
                                        {a.ability.name}
                                        {a.is_hidden && <span className="hidden-ability">(Hidden)</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="pokemon-stat">
                            {pokemon2.stats.map((stat : any) => (
                                <li key={stat.stat.name} className="stat-item">
                                    <span className="stat-name">{stat.stat.name}</span>
                                    <div className="stat-bar-container">
                                        <div
                                            className="stat-bar"
                                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                        >
                                            <span className="stat-value">{stat.base_stat}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                        <div className="pokemon-lower-info">
                            <div className="pokemon-type">
                                <h2>Types</h2>
                                <ul className="pokemon-type-list">
                                    {pokemon2.types.map((typeObj: any) => (
                                        <li key={typeObj.type.name} className={`type-badge ${typeObj.type.name}`}>
                                            {typeObj.type.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pokemon-weakness">
                                <h2>Weaknesses</h2>
                                <ul className="pokemon-weakness-list">
                                    {weaknesses2.map((weakness, index) => (
                                        <li key={index} className={`weakness-badge ${weakness}`}>
                                            {weakness}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokemonCompare;
