import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function AddServicePage() {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/services/add', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/dashboard/admin');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du service', error);
            setError('Une erreur est survenue lors de l\'ajout du service.');
        }
    };

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Ajouter un Service - MDTREZA</title>
                <meta name="description" content="Ajouter un nouveau service dans l'administration." />
            </Helmet>
            <h1>Ajouter un Nouveau Service</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nom" className="form-label">Nom du service</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description du service</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="prix" className="form-label">Prix (€)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="prix"
                        name="prix"
                        value={formData.prix}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Ajouter le Service</button>
            </form>
        </div>
    );
}

export default AddServicePage;
