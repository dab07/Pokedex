import React from 'react';
import {useParams} from "react-router-dom";

const PokemonDetail = () => {
    const {id} = useParams();
    return (

        <div className="PokemonDetail">
            <h1>{id}</h1>
            <div className="PokemonDetail-image"></div>
            <div className="PokemonDetail-stats"></div>
        </div>
    );
}
export default PokemonDetail;
