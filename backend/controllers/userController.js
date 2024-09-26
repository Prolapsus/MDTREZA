const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const logger = require('../config/logger'); // Importation de Winston pour les logs
require('dotenv').config();

// Générer un access token avec le rôle
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Expire dans 1 heure
    });
};

// Générer un refresh token avec le rôle
const generateRefreshToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d', // Expire dans 7 jours
    });
};

// Schéma de validation pour l'inscription
const registerSchema = Joi.object({
    prenom: Joi.string().required().messages({
        'string.empty': 'Le prénom est requis'
    }),
    nom: Joi.string().required().messages({
        'string.empty': 'Le nom est requis'
    }),
    dateNaissance: Joi.date().iso().required().messages({
        'date.base': 'Date de naissance invalide',
        'any.required': 'La date de naissance est requise'
    }),
    adresse: Joi.string().required().messages({
        'string.empty': 'L\'adresse est requise'
    }),
    codePostal: Joi.string().pattern(/^\d{5}$/).required().messages({
        'string.pattern.base': 'Le code postal doit être composé de 5 chiffres',
        'string.empty': 'Le code postal est requis'
    }),
    ville: Joi.string().required().messages({
        'string.empty': 'La ville est requise'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'L\'email est requis'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
        'any.required': 'Le mot de passe est requis'
    })
});

// Schéma de validation pour la connexion
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'L\'email est requis'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Le mot de passe est requis'
    })
});

// Inscription d'un utilisateur avec validation via Joi
const registerUser = async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        logger.warn(`Erreur de validation lors de l'inscription : ${error.details[0].message}`); // Log en cas d'erreur de validation
        return res.status(400).json({ message: error.details[0].message });
    }

    const { prenom, nom, dateNaissance, adresse, codePostal, ville, email, password } = req.body;

    try {
        // Vérification de l'existence de l'utilisateur
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            logger.warn(`Tentative d'inscription avec un email déjà utilisé : ${email}`);
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        // Création de l'utilisateur
        const newUser = await User.create({
            prenom,
            nom,
            dateNaissance,
            adresse,
            codePostal,
            ville,
            email,
            password // Le hook beforeCreate du models/User.js va hasher le mot de passe
        });

        logger.info(`Nouvel utilisateur créé : ${newUser.id} (${newUser.email})`);

        // Réponse avec un token JWT
        res.status(201).json({
            id: newUser.id,
            prenom: newUser.prenom,
            nom: newUser.nom,
            email: newUser.email,
            token: generateToken(newUser.id, newUser.role),
        });
    } catch (error) {
        logger.error(`Erreur lors de l'inscription de l'utilisateur : ${error.message}`);
        next(error); // Transmission de l'erreur au middleware global
    }
};

// Connexion d'un utilisateur avec validation via Joi
const loginUser = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        logger.warn(`Erreur de validation lors de la connexion : ${error.details[0].message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            logger.info(`Utilisateur connecté : ${user.id} (${user.email})`);

            // Réponse avec access token et refresh token, incluant le rôle
            res.json({
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role), // Access token
                refreshToken: generateRefreshToken(user.id, user.role), // Refresh token
            });
        } else {
            logger.warn(`Échec de la connexion pour ${email} : email ou mot de passe incorrect`);
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        logger.error(`Erreur lors de la connexion de l'utilisateur : ${error.message}`);
        next(error);
    }
};

// Route pour rafraîchir le token
const refreshToken = (req, res, next) => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Non autorisé, aucun token de rafraîchissement trouvé' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateToken(decoded.id, decoded.role);
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        logger.error(`Erreur lors du rafraîchissement du token : ${error.message}`);
        return res.status(403).json({ message: 'Token de rafraîchissement invalide' });
    }
};

// Récupérer le profil utilisateur
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            logger.info(`Profil utilisateur récupéré : ${user.id} (${user.email})`);
            res.json({
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role,
            });
        } else {
            logger.warn(`Utilisateur non trouvé pour l'ID : ${req.user.id}`);
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        logger.error(`Erreur lors de la récupération du profil de l'utilisateur : ${error.message}`);
        next(error);
    }
};

module.exports = { registerUser, loginUser, getUserProfile, refreshToken };
