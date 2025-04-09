import { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom';
import '../css/ComparePokemon.css'

const PokemonCompare = () => {
    const [allPokemon, setAllPokemon] = useState<any[]>([]);
    const [pokemon1, setPokemon1] = useState<any>(null);
    const [pokemon2, setPokemon2] = useState<any>(null);
    const [pokemon1Name, setPokemon1Name] = useState<string>('');
    const [pokemon2Name, setPokemon2Name] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [weaknesses1, setWeaknesses1] = useState<string[]>([]);
    // const [weaknesses2, setWeaknesses2] = useState<string[]>([]);


    const location = useLocation();

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
                const data = await response.json();
                setAllPokemon(data.results);

                // const types = data.types.map((typeObj: any) => typeObj.type.name);
                // await fetchWeaknesses(types);

                const searchParams = new URLSearchParams(location.search);
                const queryString = location.search.slice(1);
                const pokemonQuery = queryString.toLowerCase().split('&').map(pq => pq.trim());

                if (pokemonQuery[0]) {
                    setPokemon1Name(pokemonQuery[0]);
                    fetchPokemon(pokemonQuery[0], setPokemon1);
                }
                if (pokemonQuery[1]) {
                    setPokemon2Name(pokemonQuery[1]);
                    fetchPokemon(pokemonQuery[1], setPokemon2);
                }

                if (location.state?.pokemonName && !pokemonQuery[0]) {
                    setPokemon1Name(location.state.pokemonName);
                    fetchPokemon(location.state.pokemonName, setPokemon1);
                }

            } catch (error) {
                console.error("Error fetching Pokémon list:", error);
            }
        };

        fetchAllPokemon();
    }, []);

    const fetchPokemon = async (pokemonName: string, setPokemon: (data: any) => void) => {
        if (!pokemonName) return;

        setIsLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();
            setPokemon(data);
        } catch (error) {
            console.error(`Error fetching ${pokemonName}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePokemon1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPokemon1Name(e.target.value);
        fetchPokemon(e.target.value, setPokemon1);
    };

    const handlePokemon2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPokemon2Name(e.target.value);
        fetchPokemon(e.target.value, setPokemon2);
    };
    // const fetchWeaknesses = async (types: string[]) => {
    //     const weaknessSet = new Set<string>();
    //     for (const type of types) {
    //         try {
    //             const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    //             const data = await res.json();
    //             data.damage_relations.double_damage_from.forEach((t: any) => weaknessSet.add(t.name));
    //         } catch (error) {
    //             console.error(`Error fetching weaknesses for type ${type}:`, error);
    //         }
    //     }
    //     setWeaknesses(Array.from(weaknessSet));
    // };

    return (
        <div className="pokemon-compare">
            <h1>Compare Pokémon</h1>

            <div className="selection-container">
                <div className="pokemon-select">
                    <h2>First Pokémon</h2>
                    <select value={pokemon1Name} onChange={handlePokemon1Change}>
                        <option value="">Select a Pokémon</option>
                        {allPokemon.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="pokemon-select">
                    <h2>Second Pokémon</h2>
                    <select value={pokemon2Name} onChange={handlePokemon2Change}>
                        <option value="">Select a Pokémon</option>
                        {allPokemon.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading && <div>Loading...</div>}

            {pokemon1 && pokemon2 && !isLoading && (

                <div className="pokemon-vs">
                    <div className="pokemon1">
                        <div className="pokemon-power1">

                            <div className="pokemon-stats-section">
                                <h2>Stats</h2>
                                <ul className="stats-list">
                                    {pokemon1.stats.map((stat: any) => (
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
                                </ul>
                                <h2>Types</h2>
                                <ul className="type-list">
                                    {pokemon1.types.map((typeObj: any) => (
                                        <li key={typeObj.type.name} className={`type-badge ${typeObj.type.name}`}>
                                            {typeObj.type.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pokemon-image">
                                <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
                                <div className="about-section">
                                    <p><strong>Height:</strong> {pokemon1.height / 10} m</p>
                                    <p><strong>Weight:</strong> {pokemon1.weight / 10} kg</p>
                                    <p><strong>Base Experience:</strong> {pokemon1.base_experience}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="pokemon2">
                        <div className="pokemon-power2">

                            <div className="pokemon-image">
                                <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
                                <div className="about-section">
                                    <p><strong>Height:</strong> {pokemon2.height / 10} m</p>
                                    <p><strong>Weight:</strong> {pokemon2.weight / 10} kg</p>
                                    <p><strong>Base Experience:</strong> {pokemon2.base_experience}</p>
                                </div>
                            </div>
                            <div className="pokemon-stats-section">
                                <h2>Stats</h2>
                                <ul className="stats-list">
                                    {pokemon2.stats.map((stat: any) => (
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
                                </ul>
                                <h2>Types</h2>
                                <ul className="type-list">
                                    {pokemon2.types.map((typeObj: any) => (
                                        <li key={typeObj.type.name} className={`type-badge ${typeObj.type.name}`}>
                                            {typeObj.type.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

        //         <div className="comparison-results">
        //             <div className="pokemon-images">
        //                 <div>
        //                     <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
        //                     <h2>{pokemon1.name}</h2>
        //                     <Link to={`/${pokemon1.name}`}>View Details</Link>
        //                 </div>
        //                 <div className="vs">VS</div>
        //                 <div>
        //                     <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
        //                     <h2>{pokemon2.name}</h2>
        //                     <Link to={`/${pokemon2.name}`}>View Details</Link>
        //                 </div>
        //             </div>
        //
        //             <div className="type-comparison">
        //                 <h3>Types</h3>
        //                 <div className="types-container">
        //                     <div>
        //                         {pokemon1.types.map((t: any) => (
        //                             <span key={t.type.name} className={`type ${t.type.name}`}>{t.type.name}</span>
        //                         ))}
        //                     </div>
        //                     <div>
        //                         {pokemon2.types.map((t: any) => (
        //                             <span key={t.type.name} className={`type ${t.type.name}`}>{t.type.name}</span>
        //                         ))}
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
            )}
        </div>
    );
};

export default PokemonCompare;
