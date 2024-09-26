import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ServiceDetailPage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [message, setMessage] = useState('');
    const [dateReservation, setDateReservation] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await axios.get(`/api/services/${id}`);
                setService(data);
            } catch (error) {
                console.error("Erreur lors du chargement du service", error);
            }
        };
        fetchService();
    }, [id]);

    const handleReservation = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Vous devez être connecté pour réserver.');
                return;
            }

            if (!dateReservation) {
                setMessage('Veuillez choisir une date.');
                return;
            }

            await axios.post('/api/reservations', {
                serviceId: service.id,
                dateReservation,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Réservation réussie !');
            navigate('/dashboard/client');
        } catch (error) {
            console.error('Erreur lors de la réservation', error);
            setMessage('Erreur lors de la réservation. Veuillez réessayer.');
        }
    };

    if (!service) return <p>Chargement...</p>;

    return (
        <div className="container mt-4">
            <h2>{service.nom}</h2>
            <p>{service.description}</p>
            <p><strong>Prix : </strong>{service.prix}€</p>

            <label htmlFor="dateReservation">Choisissez une date pour votre réservation :</label>
            <input
                type="date"
                id="dateReservation"
                value={dateReservation}
                onChange={(e) => setDateReservation(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Empêche de choisir une date passée
                className="form-control mb-3"
            />

            <button className="btn btn-primary" onClick={handleReservation}>Réserver</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ServiceDetailPage;
