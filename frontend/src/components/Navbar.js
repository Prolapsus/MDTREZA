import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Nouvel état pour vérifier si l'utilisateur est admin
    const navigate = useNavigate();
    const location = useLocation(); // Utilisé pour détecter les changements de route

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); // Récupérer le rôle du localStorage
        setIsAuthenticated(!!token);
        setIsAdmin(role === 'admin'); // Vérifier si l'utilisateur est admin
    }, [location]); // Le hook est déclenché à chaque changement de route

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role'); // Supprimer le rôle lors de la déconnexion
        setIsAuthenticated(false);
        setIsAdmin(false); // Réinitialisation de l'état admin
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo MDTREZA" style={{ width: '50px' }} />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/services">Services</Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard/client">Mon Dashboard</Link>
                                </li>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/dashboard/admin">Dashboard Admin</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button className="btn nav-link" onClick={handleLogout}>Déconnexion</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Connexion</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Inscription</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
