import React, {useEffect, useState} from 'react';
import '../css/PokemonCard.css';

type PokemonCardProps = {
    pokemon: {
        id: number;
        name: string;
        sprites: {
            front_default: string;
        };
        types: Array<{ type: { name: string } }>;
        forms: any[];
        abilities?: Array<{ ability: { name: string } }>;
    };
};


function PokemonCard({ pokemon }: PokemonCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [category, setCategory] = useState<string>('Unknown');
    const [gender, setGender] = useState<string>('Unknown');

    useEffect(() => {
        if (isHovered) {
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`)
                .then((res) => res.json())
                .then((data) => {
                    // Extract Category (Genus)
                    const genusEntry = data.genera.find((entry: any) => entry.language.name === "en");
                    setCategory(genusEntry ? genusEntry.genus : 'Unknown');

                    // Determine Gender Distribution
                    if (data.gender_rate === -1) {
                        setGender('Genderless');
                    } else {
                        setGender(data.gender_rate > 4 ? '♀ Mostly Female' : '♂ Mostly Male');
                    }
                })
                .catch((error) => console.error('Error fetching species data:', error));
        }
    }, [isHovered, pokemon.id]);

    return (
        <div
            className="pokemon-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={pokemon.sprites?.front_default ||
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}
                alt={pokemon.name}
                className="pokemon-image"
                onError={(e) => e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}
            />

            {/* Pokémon Name & ID */}
            <div className="pokemon-info">
                <h3 className="pokemon-name">{pokemon.name}</h3>
                <p className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</p>
            </div>

            <div className="pokemon-types">
                {pokemon.types.map((typeInfo, index) => (
                    <span key={index} className={`type-badge ${typeInfo.type.name}`}>
                        {typeInfo.type.name}
                    </span>
                ))}
            </div>

            {/* Hover Overlay: Abilities, Category, Gender */}
            {isHovered && (
                <div className="pokemon-details">
                    <p><strong>Abilities:</strong> {pokemon.abilities?.map(ability => ability.ability.name).join(', ') || 'Unknown'}</p>
                    <p><strong>Category:</strong> {category}</p>
                    <p><strong>Gender:</strong> {gender}</p>
                </div>
            )}
        </div>
    );
}

export default PokemonCard;
