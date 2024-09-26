import React from 'react';
import { Helmet } from 'react-helmet-async';

function HomePage() {
    return (
        <div className="container mt-4">
            <Helmet>
                <title>Accueil - MDTREZA</title>
                <meta name="description" content="Bienvenue sur le site du Domaine Thermal. Découvrez nos services de bien-être et de relaxation." />
                <meta name="keywords" content="bien-être, soins thermaux, relaxation, spa, domaine thermal" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.mdtreza.com/" />
            </Helmet>
            <h1>Bienvenue au Domaine Thermal</h1>
            <p>Découvrez nos services et prenez soin de vous grâce à nos soins thermaux.</p>
        </div>
    );
}

export default HomePage;
