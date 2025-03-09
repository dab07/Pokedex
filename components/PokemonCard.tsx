import React, { useState } from 'react';
import '../css/PokemonCard.css';

type PokemonCardProps = {
    pokemon: {
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
    };
};

function PokemonCard({ pokemon }: PokemonCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Fallback image in case the sprite is missing
    const imgSrc = pokemon.sprites?.front_default ||
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

    return (
        <div
            className="pokemon-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={imgSrc}
                alt={pokemon.name}
                className="pokemon-image"
                onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                }}
            />

            <div className="pokemon-info">
                <h3 className="pokemon-name">{pokemon.name}</h3>
                <p className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</p>
            </div>

            {isHovered && (
                <div className="pokemon-details">
                    <div className="pokemon-types">
                        {pokemon.types?.map((typeInfo, index) => (
                            <span
                                key={index}
                                className={`type-badge ${typeInfo.type.name}`}
                            >
                {typeInfo.type.name}
              </span>
                        ))}
                    </div>

                    <div className="pokemon-forms">
                        <p>Forms: {pokemon.forms?.length > 0
                            ? pokemon.forms.map((form: any) => form.name).join(', ')
                            : 'Standard'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PokemonCard;
