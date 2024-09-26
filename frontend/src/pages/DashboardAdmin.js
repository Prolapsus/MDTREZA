import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import {Link} from "react-router-dom";

function DashboardAdmin() {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [reservations, setReservations] = useState([]);

    const [userSortConfig, setUserSortConfig] = useState({ key: 'prenom', direction: 'asc' });
    const [serviceSortConfig, setServiceSortConfig] = useState({ key: 'nom', direction: 'asc' });
    const [reservationSortConfig, setReservationSortConfig] = useState({ key: 'dateReservation', direction: 'asc' });

    useEffect(() => {
        fetchUsers();
        fetchServices();
        fetchReservations();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs', error);
        }
    };

    const fetchServices = async () => {
        try {
            const { data } = await axios.get('/api/services', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setServices(data);
        } catch (error) {
            console.error('Erreur lors du chargement des services', error);
        }
    };

    const fetchReservations = async () => {
        try {
            const { data } = await axios.get('/api/reservations', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReservations(data);
        } catch (error) {
            console.error('Erreur lors du chargement des réservations', error);
        }
    };

    // Fonction de tri pour les utilisateurs
    const handleUserSort = (key) => {
        let direction = 'asc';
        if (userSortConfig.key === key && userSortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setUserSortConfig({ key, direction });

        const sortedUsers = [...users].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setUsers(sortedUsers);
    };

    const getUserSortIcon = (key) => {
        if (userSortConfig.key !== key) {
            return <FaSort aria-hidden="true" />;
        }
        return userSortConfig.direction === 'asc' ? <FaSortUp aria-hidden="true" /> : <FaSortDown aria-hidden="true" />;
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
    };

    // Fonction de tri pour les services
    const handleServiceSort = (key) => {
        let direction = 'asc';
        if (serviceSortConfig.key === key && serviceSortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setServiceSortConfig({ key, direction });

        const sortedServices = [...services].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setServices(sortedServices);
    };

    const getServiceSortIcon = (key) => {
        if (serviceSortConfig.key !== key) {
            return <FaSort aria-hidden="true" />;
        }
        return serviceSortConfig.direction === 'asc' ? <FaSortUp aria-hidden="true" /> : <FaSortDown aria-hidden="true" />;
    };

    const handleDeleteService = async (serviceId) => {
        try {
            await axios.delete(`/api/services/${serviceId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setServices(services.filter(service => service.id !== serviceId));
        } catch (error) {
            console.error('Erreur lors de la suppression du service', error);
        }
    };

    // Fonction de tri pour les réservations
    const handleReservationSort = (key) => {
        let direction = 'asc';
        if (reservationSortConfig.key === key && reservationSortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setReservationSortConfig({ key, direction });

        const sortedReservations = [...reservations].sort((a, b) => {
            if (key === 'dateReservation') {
                return direction === 'asc'
                    ? new Date(a.dateReservation) - new Date(b.dateReservation)
                    : new Date(b.dateReservation) - new Date(a.dateReservation);
            } else if (key === 'service') {
                return direction === 'asc'
                    ? a.Service?.nom.localeCompare(b.Service?.nom)
                    : b.Service?.nom.localeCompare(a.Service?.nom);
            } else if (key === 'user') {
                return direction === 'asc'
                    ? a.User?.prenom.localeCompare(b.User?.prenom)
                    : b.User?.prenom.localeCompare(a.User?.prenom);
            }
            return 0;
        });
        setReservations(sortedReservations);
    };

    const getReservationSortIcon = (key) => {
        if (reservationSortConfig.key !== key) {
            return <FaSort aria-hidden="true" />;
        }
        return reservationSortConfig.direction === 'asc' ? <FaSortUp aria-hidden="true" /> : <FaSortDown aria-hidden="true" />;
    };

    const handleDeleteReservation = async (reservationId) => {
        try {
            await axios.delete(`/api/reservations/${reservationId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReservations(reservations.filter(reservation => reservation.id !== reservationId));
        } catch (error) {
            console.error('Erreur lors de la suppression de la réservation', error);
        }
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Tableau de bord Administrateur</title>
                <meta name="description" content="Gérez les utilisateurs, services, et réservations." />
            </Helmet>
            <h1>Tableau de bord Administrateur</h1>

            <h2>Gestion des Utilisateurs</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th onClick={() => handleUserSort('prenom')} style={{ cursor: 'pointer' }}>
                        Prénom {getUserSortIcon('prenom')}
                    </th>
                    <th onClick={() => handleUserSort('nom')} style={{ cursor: 'pointer' }}>
                        Nom {getUserSortIcon('nom')}
                    </th>
                    <th onClick={() => handleUserSort('email')} style={{ cursor: 'pointer' }}>
                        Email {getUserSortIcon('email')}
                    </th>
                    <th onClick={() => handleUserSort('role')} style={{ cursor: 'pointer' }}>
                        Rôle {getUserSortIcon('role')}
                    </th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user?.prenom || 'Inconnu'}</td>
                        <td>{user?.nom || 'Inconnu'}</td>
                        <td>{user?.email || 'Inconnu'}</td>
                        <td>{user?.role || 'Inconnu'}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)} aria-label={`Supprimer l'utilisateur ${user.prenom}`}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Gestion des Services</h2>
            <Link to="/admin/add-service" className="btn btn-success mb-3">Ajouter un Nouveau Service</Link>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th onClick={() => handleServiceSort('nom')} style={{ cursor: 'pointer' }}>
                        Nom {getServiceSortIcon('nom')}
                    </th>
                    <th onClick={() => handleServiceSort('description')} style={{ cursor: 'pointer' }}>
                        Description {getServiceSortIcon('description')}
                    </th>
                    <th onClick={() => handleServiceSort('prix')} style={{ cursor: 'pointer' }}>
                        Prix {getServiceSortIcon('prix')}
                    </th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {services.map(service => (
                    <tr key={service.id}>
                        <td>{service.nom}</td>
                        <td>{service.description}</td>
                        <td>{service.prix}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDeleteService(service.id)} aria-label={`Supprimer le service ${service.nom}`}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Gestion des Réservations</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th onClick={() => handleReservationSort('user')} style={{ cursor: 'pointer' }}>
                        Utilisateur {getReservationSortIcon('user')}
                    </th>
                    <th onClick={() => handleReservationSort('service')} style={{ cursor: 'pointer' }}>
                        Service {getReservationSortIcon('service')}
                    </th>
                    <th onClick={() => handleReservationSort('dateReservation')} style={{ cursor: 'pointer' }}>
                        Date de Réservation {getReservationSortIcon('dateReservation')}
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map(reservation => (
                    <tr key={reservation.id}>
                        <td>{reservation?.User?.prenom || 'Inconnu'} {reservation?.User?.nom || ''}</td>
                        <td>{reservation?.Service?.nom || 'Inconnu'}</td>
                        <td>{new Date(reservation?.dateReservation).toLocaleDateString()}</td>
                        <td>{reservation.status}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDeleteReservation(reservation.id)} aria-label={`Supprimer la réservation de ${reservation.User?.prenom}`}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DashboardAdmin;
