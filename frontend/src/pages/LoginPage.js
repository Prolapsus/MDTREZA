import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', {
                email: email.trim(), // Supprime les espaces inutiles
                password
            });

            // Stocker le token et le rôle dans le localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role); // Stocker le rôle (admin ou client)

            // Redirection en fonction du rôle
            if (data.role === 'admin') {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/client');
            }

            if (onLogin) onLogin(); // Assure que l'événement onLogin est appelé si défini
        } catch (error) {
            console.error('Erreur de connexion', error);
            setErrorMessage('Échec de la connexion. Veuillez vérifier vos informations.');
        }
    };


    return (
        <div className="container mt-4">
            <Helmet>
                <title>Connexion - Domaine Thermal</title>
                <meta name="description" content="Connectez-vous à votre compte pour réserver nos services de bien-être." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <h1 className="my-4">Connexion</h1>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label" aria-label="Email requis">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre email"
                        aria-required="true"
                        required
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">
                        Nous ne partagerons jamais votre email avec quelqu'un d'autre.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label" aria-label="Mot de passe requis">Mot de passe</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez votre mot de passe"
                        aria-required="true"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Connexion</button>
            </form>
        </div>
    );
}

export default LoginPage;
