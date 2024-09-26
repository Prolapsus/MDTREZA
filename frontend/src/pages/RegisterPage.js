import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function RegisterPage() {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        dateNaissance: '',
        adresse: '',
        codePostal: '',
        ville: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const postalCodeRegex = /^[0-9]{5}$/;

        if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
        if (!formData.nom) newErrors.nom = 'Le nom est requis';
        if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';
        if (!formData.adresse) newErrors.adresse = "L'adresse est requise";
        if (!postalCodeRegex.test(formData.codePostal)) newErrors.codePostal = 'Le code postal doit comporter 5 chiffres';
        if (!formData.ville) newErrors.ville = 'La ville est requise';
        if (!emailRegex.test(formData.email)) newErrors.email = 'Email invalide';
        if (formData.password.length < 6) newErrors.password = 'Le mot de passe doit comporter au moins 6 caractères';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Réinitialise les erreurs à chaque soumission

        if (validateForm()) {
            // Exclure le champ confirmPassword des données envoyées au serveur
            const { confirmPassword, ...dataToSubmit } = formData;

            try {
                await axios.post('/api/users/register', dataToSubmit);
                navigate('/login');
            } catch (error) {
                // Gestion des erreurs retournées par Joi
                if (error.response && error.response.data.message) {
                    setErrors({ api: error.response.data.message });
                } else {
                    setErrors({ api: 'Une erreur s\'est produite. Veuillez réessayer.' });
                }
            }
        }
    };


    return (
        <div className="container mt-4">
            <Helmet>
                <title>Inscription - MDTREZA</title>
                <meta name="description" content="Créez votre compte pour réserver nos services de bien-être." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <h1>Inscription</h1>
            {errors.api && <p className="text-danger">{errors.api}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="prenom" className="form-label" aria-label="Prénom requis">Prénom</label>
                    <input
                        type="text"
                        className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="Entrez votre prénom"
                        required
                        aria-required="true"
                    />
                    {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="nom" className="form-label" aria-label="Nom requis">Nom</label>
                    <input
                        type="text"
                        className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Entrez votre nom"
                        required
                        aria-required="true"
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="dateNaissance" className="form-label" aria-label="Date de naissance">Date de naissance</label>
                    <input
                        type="date"
                        className={`form-control ${errors.dateNaissance ? 'is-invalid' : ''}`}
                        id="dateNaissance"
                        name="dateNaissance"
                        value={formData.dateNaissance}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                    />
                    {errors.dateNaissance && <div className="invalid-feedback">{errors.dateNaissance}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="adresse" className="form-label" aria-label="Adresse">Adresse</label>
                    <input
                        type="text"
                        className={`form-control ${errors.adresse ? 'is-invalid' : ''}`}
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        placeholder="Entrez votre adresse"
                        required
                        aria-required="true"
                    />
                    {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="codePostal" className="form-label" aria-label="Code postal">Code postal</label>
                    <input
                        type="text"
                        className={`form-control ${errors.codePostal ? 'is-invalid' : ''}`}
                        id="codePostal"
                        name="codePostal"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        placeholder="Entrez votre code postal"
                        required
                        aria-required="true"
                    />
                    {errors.codePostal && <div className="invalid-feedback">{errors.codePostal}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="ville" className="form-label" aria-label="Ville">Ville</label>
                    <input
                        type="text"
                        className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                        id="ville"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        placeholder="Entrez votre ville"
                        required
                        aria-required="true"
                    />
                    {errors.ville && <div className="invalid-feedback">{errors.ville}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label" aria-label="Email">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Entrez votre email"
                        required
                        aria-required="true"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label" aria-label="Mot de passe">Mot de passe</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Entrez votre mot de passe"
                        required
                        aria-required="true"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label" aria-label="Confirmation du mot de passe">Confirmez votre mot de passe</label>
                    <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirmez votre mot de passe"
                        required
                        aria-required="true"
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary">S'inscrire</button>
            </form>
        </div>
    );
}

export default RegisterPage;
