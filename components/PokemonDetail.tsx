import {Link, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';


const PokemonDetail = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<any>(null);
    const [evolutionChain, setEvolutionChain] = useState<any[]>([]);
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

    if (isLoading || !pokemon) return <div>Loading...</div>;

    return (
        <div className="pokemon-detail">
            <h1>{pokemon.name} (#{pokemon.id})</h1>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <div className="about-section">
                <h2>About</h2>
                <p><strong>Height:</strong> {pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
            </div>
            <div className="weakness-section">
                <h2>Weaknesses</h2>
                <ul>
                    {weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                    ))}
                </ul>
            </div>
            <div className="versions-section">
                <h2>Game Versions</h2>
                <ul>
                    {pokemon.game_indices.map((entry: any) => (
                        <li key={entry.version.name}>{entry.version.name}</li>
                    ))}
                </ul>
            </div>
            <h2>Types:</h2>
            <ul>
                {pokemon.types.map((typeObj: any) => (
                    <li key={typeObj.type.name}>{typeObj.type.name}</li>
                ))}
            </ul>

            <h2>Stats:</h2>
            <ul>
                {pokemon.stats.map((stat: any) => (
                    <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                ))}

            </ul>

            <h2>Abilities:</h2>
            <ul>
                {pokemon.abilities.map((a: any) => (
                    <li key={a.ability.name}>{a.ability.name}</li>
                ))}
            </ul>

            <h2>Evolution Chain:</h2>
            <ul>
                {evolutionChain.map((evoName, index) => (
                    <li key={index}>{evoName} <img src={pokemon.image}/></li>
                ))}
            </ul>
            <div className="pokemon-compare">
                <Link to='/compare' state={{ pokemonName: name }}>Compare with other Pokemon</Link>
            </div>
        </div>
    );
};

export default PokemonDetail;
