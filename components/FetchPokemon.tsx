import react, {useEffect, useState} from 'react';
import PokemonGrid from "./PokemonGrid";
import '../css/PokemonGrid.css'
type Pokemon = {
    id: number;
    name: string;
    url: string;
    image: string;
    types : Array<{
        type : {
            name: string,
        }
    }>
    past_types: Array<{
        generation : {
            name: string,
        }
    }>
}

const FetchPokemon = () => {
    const [pokemons, setpokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
                const pokemonResponse = await response.json();

                const detailedPokemon = await Promise.all(
                    pokemonResponse.results.map(async (pokemon: any, index: number) => {
                        const id = index + 1;
                        // Make additional API call to get detailed Pokemon info
                        const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                        const pokemonDetails = await detailResponse.json();

                        return {
                            id,
                            name: pokemon.name,
                            url: pokemon.url,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                            types: pokemonDetails.types || [],
                            past_types: pokemonDetails.past_types || [],
                        };
                    })
                );

                setpokemons(detailedPokemon);
            } catch (e) {
                console.error("Failed to fetch Pokemons", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPokemons();
    }, []);


    return (
        <div className="pokemon-container">
            {pokemons.map(pokemon => (
                <PokemonGrid key={pokemon.id} pokemon={pokemon}></PokemonGrid>
            ))}
        </div>
    )
}

export default FetchPokemon;
