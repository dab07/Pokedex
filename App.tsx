import React from 'react';

import './css/App.css';
import PokemonDetail from "./components/PokemonDetail";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import FetchPokemon from "./components/FetchPokemon";
import ComparePokemon from "./components/ComparePokemon";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FetchPokemon/>}/>
                    <Route path="/:name" element={<PokemonDetail />} />
                    <Route path="/compare" element={<ComparePokemon />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
