import {useEffect, useState} from 'react';
import PokemonGrid from "./PokemonGrid";
import '../css/PokemonGrid.css'
import NavigationBar from "./NavigationBar";
import {useNavigate} from "react-router-dom";

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
    const [searchPokemon, setSearchPokemon] = useState<Pokemon[]>([]);
    const navigate = useNavigate();
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
                setSearchPokemon(detailedPokemon);
            } catch (e) {
                console.error("Failed to fetch Pokemons", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPokemons();
    }, []);

    const handleSearchPokemon = (pokemonSearchString : string) => {
        if (!pokemonSearchString.trim()) {
            setSearchPokemon(pokemons);
            return;
        }
        const filteredPokemons = pokemons.filter((pokeSearch) => {
            const idString = pokeSearch.id.toString().includes(pokemonSearchString.trim());
            const nameString = pokeSearch.name.toLowerCase().toString().includes(pokemonSearchString.trim().toLowerCase());
            return idString ||nameString;
        });
        setSearchPokemon(filteredPokemons);
    }

    const handleSortedPokemons = (sortOrder : string) => {
        const sortedPokemons = [...searchPokemon];

        switch (sortOrder) {
            case 'a-z':
                sortedPokemons.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'z-a':
                sortedPokemons.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'id-asc':
                sortedPokemons.sort((a, b) => a.id - b.id);
                break;
            case 'id-desc':
                sortedPokemons.sort((a, b) => b.id - a.id);
                break;
            default:
                sortedPokemons.sort((a, b) => a.id - b.id);
        }
        setSearchPokemon(sortedPokemons);
    }
    return (
        <div>
            <NavigationBar onSearch={handleSearchPokemon} onSort={handleSortedPokemons} pokemon={pokemons}/>
            {isLoading ? <h2>Loading...</h2> : null}
            <div className="pokemon-container">
                {searchPokemon.map(poke => (
                    <PokemonGrid key={poke.id} pokemon={poke}></PokemonGrid>
                ))}
            </div>

        </div>
    )
}

export default FetchPokemon;
