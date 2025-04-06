import React from 'react';
import '../css/PokemonGrid.css';

type Pokemon = {
    id: number;
    name: string;
    url: string;
    image: string;
    types: Array<{
        type: {
            name: string,
        }
    }>
    past_types: Array<{
        generation: {
            name: string,
        }
    }>
}

const PokemonGrid= ({ pokemon } : {pokemon : Pokemon}) => {
    return (
        <div className="pokemon-card">
            <div className="card-content">
                <div className="card-image">
                    <img src={pokemon.image} alt={pokemon.name} />
                </div>
                <div className="card-footer">
                    <div className="card-name">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </div>
                    <div className="card-types">
                        {pokemon.types.map((typeInfo, index) => (
                            <span key={index} className={`type ${typeInfo.type.name}`}>
                                {typeInfo.type.name}
                            </span>
                        ))}
                    </div>

                </div>
            </div>
            <div className="card-id">#{pokemon.id.toString().padStart(4, '0')}</div>
        </div>
    );
};

export default PokemonGrid;
