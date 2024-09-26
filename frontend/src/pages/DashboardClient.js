import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

function DashboardClient() {
    const [reservations, setReservations] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'dateReservation', direction: 'desc' });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const { data } = await axios.get('/api/reservations/myreservations', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setReservations(data);
            } catch (error) {
                console.error('Erreur lors du chargement des réservations', error);
                alert('Erreur lors du chargement de vos réservations, veuillez réessayer.');
            }
        };
        fetchReservations();
    }, []);

    const handlePay = (reservationId) => {
        window.location.href = `https://paypal.com/pay?reservationId=${reservationId}`;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedReservations = [...reservations].sort((a, b) => {
            if (key === 'dateReservation') {
                return direction === 'asc'
                    ? new Date(a.dateReservation) - new Date(b.dateReservation)
                    : new Date(b.dateReservation) - new Date(a.dateReservation);
            } else if (key === 'service') {
                return direction === 'asc'
                    ? a.Service.nom.localeCompare(b.Service.nom)
                    : b.Service.nom.localeCompare(a.Service.nom);
            } else if (key === 'status') {
                return direction === 'asc'
                    ? a.status.localeCompare(b.status)
                    : b.status.localeCompare(a.status);
            }
            return 0;
        });
        setReservations(sortedReservations);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort aria-hidden="true" />;
        }
        return sortConfig.direction === 'asc' ? <FaSortUp aria-hidden="true" /> : <FaSortDown aria-hidden="true" />;
    };

    const handleCancelReservation = async (id, dateReservation) => {
        const today = new Date();
        const reservationDate = new Date(dateReservation);

        if (reservationDate < today) {
            alert("Impossible d'annuler une réservation passée.");
            return;
        }

        try {
            await axios.put(`/api/reservations/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReservations(reservations.map(reservation =>
                reservation.id === id ? { ...reservation, status: 'annulée' } : reservation
            ));
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la réservation', error);
            alert('Erreur lors de l\'annulation de la réservation, veuillez réessayer.');
        }
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Tableau de bord - Mes Réservations</title>
                <meta name="description" content="Consultez et gérez vos réservations." />
            </Helmet>
            <h1>Tableau de bord - Mes Réservations</h1>
            {reservations.length === 0 ? (
                <p>Aucune réservation à afficher.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('service')} style={{ cursor: 'pointer' }}>
                            Service {getSortIcon('service')}
                        </th>
                        <th onClick={() => handleSort('dateReservation')} style={{ cursor: 'pointer' }}>
                            Date de Réservation {getSortIcon('dateReservation')}
                        </th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                            Statut {getSortIcon('status')}
                        </th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.Service.nom}</td>
                            <td>{new Date(reservation.dateReservation).toLocaleDateString()}</td>
                            <td>{reservation.status}</td>
                            <td>
                                {reservation.status === 'confirmée' && (
                                    <>
                                        <button
                                            className="btn btn-danger me-2"
                                            onClick={() => handleCancelReservation(reservation.id, reservation.dateReservation)}
                                            aria-label="Annuler la réservation"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handlePay(reservation.id)}
                                            aria-label="Payer la réservation"
                                        >
                                            Payer
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DashboardClient;
