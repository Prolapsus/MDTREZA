import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function ServicesPage() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get('/api/services');
                setServices(data);
            } catch (error) {
                console.error('Erreur lors du chargement des services', error);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Nos Services - Domaine Thermal</title>
                <meta name="description" content="Découvrez nos services de bien-être et réservez votre soin." />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <h1>Nos Services</h1>
            <div className="row">
                {services.map(service => (
                    <div key={service.id} className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{service.nom}</h5>
                                <p className="card-text">{service.description}</p>
                                <p className="card-text"><strong>Prix : </strong>{service.prix}€</p>
                                <Link to={`/services/${service.id}`} className="btn btn-primary" aria-label={`Voir les détails du service ${service.nom}`}>
                                    Voir les détails
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServicesPage;
