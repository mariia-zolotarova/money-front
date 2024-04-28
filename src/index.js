import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import './styles/main.scss'
import {BrowserRouter} from "react-router-dom";
import {ConfigProvider} from "antd";



// http://localhost:1337/graphql

const client = new ApolloClient({
    uri: `${process.env.BASE_URL}/graphql`,
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <ApolloProvider client={client}>
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#00b96b',

                    // Alias Token
                    colorBgContainer: '#f6ffed',
                },
            }}
        >
        <App />
        </ConfigProvider>
    </ApolloProvider>
    </BrowserRouter>
);

