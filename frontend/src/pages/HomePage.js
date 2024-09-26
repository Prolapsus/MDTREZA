import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

function HomePage() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(
                    `/api/weather` // Remplacer par une route backend qui cache la clé API
                );
                setWeather(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération des données météo.');
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="container mt-5">
            <Helmet>
                <title>Accueil - MDTREZA</title>
                <meta name="description" content="Bienvenue sur le site du Domaine Thermal. Découvrez nos services de bien-être et de relaxation." />
                <meta name="keywords" content="bien-être, soins thermaux, relaxation, spa, domaine thermal" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.mdtreza.com/" />
            </Helmet>

            <div className="text-center">
                <h1 className="display-4 mb-4">Bienvenue au Domaine Thermal</h1>
                <p className="lead mb-5">Découvrez nos services et prenez soin de vous grâce à nos soins thermaux.</p>
            </div>

            {weather ? (
                <div className="text-center mt-5">
                    <h2>Météo actuelle à {weather.name}</h2>
                    <p>Température : {weather.main.temp}°C</p>
                    <p>Conditions : {weather.weather[0].description}</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Conditions météo" />
                </div>
            ) : (
                <p className="text-center">{error ? error : 'Chargement des données météo...'}</p>
            )}
        </div>
    );
}

export default HomePage;
