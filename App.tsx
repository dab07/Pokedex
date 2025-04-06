import React from 'react';

import './css/App.css';
import PokemonDetail from "./components/PokemonDetail";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import FetchPokemon from "./components/FetchPokemon";

function App() {
    return (
        <div className="App">
            <h1>PokeDecx</h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FetchPokemon/>}/>
                    <Route path="/pokemon/:id" element={<PokemonDetail />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
