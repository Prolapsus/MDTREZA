const Joi = require('joi');
const Reservation = require('../models/Reservation');
const Service = require('../models/Service');
const User = require('../models/User');
const logger = require('../config/logger'); // Import de Winston pour les logs

// Schéma de validation pour les réservations avec Joi
const reservationSchema = Joi.object({
    serviceId: Joi.number().integer().required().messages({
        'number.base': 'ID de service invalide',
        'any.required': 'L\'ID de service est requis'
    }),
    dateReservation: Joi.date().iso().required().messages({
        'date.base': 'Date de réservation invalide',
        'any.required': 'La date de réservation est requise'
    })
});

// Créer une réservation
const createReservation = async (req, res, next) => {
    const { error } = reservationSchema.validate(req.body);
    if (error) {
        logger.warn(`Erreur de validation Joi : ${error.details[0].message}`); // Log de l'erreur de validation
        return res.status(400).json({ message: error.details[0].message });
    }

    const { serviceId, dateReservation } = req.body;

    try {
        logger.info(`Tentative de création de réservation pour le service ID : ${serviceId} par l'utilisateur ${req.user.id}`); // Log de l'action
        const service = await Service.findByPk(serviceId);
        if (!service) {
            logger.warn(`Service non trouvé pour ID : ${serviceId}`); // Log si le service n'est pas trouvé
            return res.status(404).json({ message: 'Service non trouvé' });
        }

        const newReservation = await Reservation.create({
            userId: req.user.id,
            serviceId: service.id,
            dateReservation
        });

        logger.info(`Nouvelle réservation créée pour l'utilisateur ${req.user.id} avec le service ID : ${serviceId}`); // Log de la réussite
        res.status(201).json(newReservation);
    } catch (error) {
        logger.error(`Erreur lors de la création de la réservation pour le service ID : ${serviceId} par l'utilisateur ${req.user.id} : ${error.message}`);
        next(error); // Transmission de l'erreur au middleware
    }
};

// Obtenir toutes les réservations d'un utilisateur
const getUserReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.findAll({
            where: { userId: req.user.id },
            include: [
                { model: Service, attributes: ['nom'] }
            ],
            order: [['dateReservation', 'DESC']]
        });
        logger.info(`Récupération des réservations pour l'utilisateur ${req.user.id}`); // Log de la récupération des réservations
        res.json(reservations);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des réservations de l'utilisateur ${req.user.id} : ${error.message}`);
        next(error);
    }
};

// Annuler une réservation
const cancelReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation || reservation.userId !== req.user.id) {
            logger.warn(`Réservation non trouvée ou accès non autorisé pour l'utilisateur ${req.user.id} à la réservation ${req.params.id}`);
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        const today = new Date();
        if (new Date(reservation.dateReservation) < today) {
            logger.warn(`Tentative d'annulation d'une réservation passée par l'utilisateur ${req.user.id}`);
            return res.status(400).json({ message: "Impossible d'annuler une réservation passée" });
        }

        reservation.status = 'annulée';
        await reservation.save();

        logger.info(`Réservation ${reservation.id} annulée par l'utilisateur ${req.user.id}`);
        res.json({ message: 'Réservation annulée', reservation });
    } catch (error) {
        logger.error(`Erreur lors de l'annulation de la réservation ${req.params.id} par l'utilisateur ${req.user.id} : ${error.message}`);
        next(error);
    }
};

// Supprimer une réservation (admin)
const deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) {
            logger.warn(`Réservation avec l'id ${req.params.id} non trouvée`);
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        await reservation.destroy();
        logger.info(`Réservation ${req.params.id} supprimée par un admin`);
        res.status(200).json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de la réservation ${req.params.id} : ${error.message}`);
        next(error);
    }
};

// Voir toutes les réservations (admin)
const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.findAll({
            include: [
                { model: User, attributes: ['prenom', 'nom'] },
                { model: Service, attributes: ['nom'] }
            ],
            order: [['dateReservation', 'DESC']]
        });
        logger.info(`Récupération de toutes les réservations (admin)`);
        res.json(reservations);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des réservations (admin) : ${error.message}`);
        next(error);
    }
};

module.exports = { createReservation, getUserReservations, cancelReservation, getAllReservations, deleteReservation };
