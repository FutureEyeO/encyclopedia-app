import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
// import "materialize-css"
import dotenv from "dotenv"
import App from './App';

import { AuthContextProvider, AuthContext } from './context/AuthContext';
import { updateLoginApiContext } from "./ApiContext"

dotenv.config()

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
