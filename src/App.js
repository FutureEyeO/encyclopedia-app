import React from 'react';
import ReactDOM from 'react-dom';
import { Btn } from "./components/styles/Buttons.jsx"
import { Container } from '@material-ui/core';

function App() {
    return (
        <div className="App">
            <header className="App-header">
            </header>
            {/* <Container> */}

            <Btn>click me</Btn>
            <Btn>click me</Btn>
            <Btn>click me</Btn>
            {/* </Container> */}

        </div>
    );
}

export default App;
