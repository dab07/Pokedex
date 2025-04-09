import {Link, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/PokemonDetail.css'

const PokemonDetail = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<any>(null);
    const [evolutionChain, setEvolutionChain] = useState<any[]>([]);
    const [evolutionDetails, setEvolutionDetails] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [weaknesses, setWeaknesses] = useState<string[]>([]);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const data = await response.json();
                setPokemon(data);

                // Fetch weaknesses based on pokemon types
                const types = data.types.map((typeObj: any) => typeObj.type.name);
                await fetchWeaknesses(types);

                // Fetch species and evolution chain
                const speciesRes = await fetch(data.species.url);
                const speciesData = await speciesRes.json();
                const evoChainRes = await fetch(speciesData.evolution_chain.url);
                const evoData = await evoChainRes.json();

                const chain = [];
                let evo = evoData.chain;
                while (evo) {
                    chain.push(evo.species.name);
                    evo = evo.evolves_to[0];
                }
                setEvolutionChain(chain);

                // Fetch details for each evolution
                const evoDetails = await Promise.all(
                    chain.map(async (pokeName) => {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
                        return await res.json();
                    })
                );
                setEvolutionDetails(evoDetails);
            } catch (error) {
                console.error("Error fetching Pokémon detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [name]);

    const fetchWeaknesses = async (types: string[]) => {
        const weaknessSet = new Set<string>();
        for (const type of types) {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
                const data = await res.json();
                data.damage_relations.double_damage_from.forEach((t: any) => weaknessSet.add(t.name));
            } catch (error) {
                console.error(`Error fetching weaknesses for type ${type}:`, error);
            }
        }
        setWeaknesses(Array.from(weaknessSet));
    };

    if (isLoading || !pokemon) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="pokemon-detail">
            <div className="pokemon-section1">
                <h1>{pokemon.name} <span className="pokemon-id">#{pokemon.id}</span></h1>
                <div className="pokemon-section2">
                    <div className="pokemon-image">
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    </div>
                    <div className="about-section">
                        <h2>About</h2>
                        <p><strong>Height:</strong> {pokemon.height / 10} m</p>
                        <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                        <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
                    </div>
                </div>
                <div className="pokemon-section3">
                    <div className="type-section">
                        <h2>Types</h2>
                        <ul className="type-list">
                            {pokemon.types.map((typeObj: any) => (
                                <li key={typeObj.type.name} className={`type-badge ${typeObj.type.name}`}>
                                    {typeObj.type.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="weakness-section">
                        <h2>Weaknesses</h2>
                        <ul className="weakness-list">
                            {weaknesses.map((weakness, index) => (
                                <li key={index} className={`weakness-badge ${weakness}`}>
                                    {weakness}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="versions-section">
                <h2>Game Versions</h2>
                <ul className="version-list">
                    {pokemon.game_indices.map((entry: any) => (
                        <li key={entry.version.name} className="version-badge">
                            {entry.version.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pokemon-stats-section">
                <h2>Stats</h2>
                <ul className="stats-list">
                    {pokemon.stats.map((stat: any) => (
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
            </div>

            <div className="pokemon-ability-section">
                <h2>Abilities</h2>
                <ul className="ability-list">
                    {pokemon.abilities.map((a: any) => (
                        <li key={a.ability.name} className="ability-item">
                            {a.ability.name} {a.is_hidden && <span className="hidden-ability">(Hidden)</span>}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pokemon-evolchain-section">
                <h2>Evolution Chain</h2>
                <div className="evolution-chain">
                    {evolutionDetails.map((evoPokemon, index) => (
                        <div key={evoPokemon.name} className="evo-pokemon">
                            <img
                                src={evoPokemon.sprites.front_default}
                                alt={evoPokemon.name}
                                className="evo-sprite"
                            />
                            <p className="evo-name">
                                {evoPokemon.name}
                                <span className="evo-id">#{evoPokemon.id}</span>
                            </p>
                            {index < evolutionDetails.length - 1 && (
                                <div className="evo-arrow">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pokemon-compare">
                <Link to='/compare' state={{ pokemonName: name }}>Compare with other Pokemon</Link>
            </div>
        </div>
    );
};

export default PokemonDetail;
