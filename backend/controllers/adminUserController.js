const Joi = require('joi');
const User = require('../models/User');
const logger = require('../config/logger'); // Importation de Winston pour les logs

// Schéma de validation pour l'ID utilisateur avec Joi
const userIdSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'ID utilisateur invalide',
        'any.required': 'L\'ID utilisateur est requis'
    })
});

// Obtenir tous les utilisateurs (admin uniquement)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        logger.info('Tous les utilisateurs ont été récupérés par un admin'); // Log de la récupération des utilisateurs
        res.json(users);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des utilisateurs : ${error.message}`);
        next(error); // Transmettre l'erreur au middleware global
    }
};

// Supprimer un utilisateur avec validation via Joi (admin uniquement)
const deleteUser = async (req, res, next) => {
    const { error } = userIdSchema.validate(req.params);
    if (error) {
        logger.warn(`Erreur de validation lors de la suppression d'un utilisateur : ${error.details[0].message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            logger.warn(`Utilisateur avec l'id ${req.params.id} non trouvé`);
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await user.destroy();
        logger.info(`Utilisateur ${req.params.id} supprimé avec succès par un admin`);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de l'utilisateur ${req.params.id} : ${error.message}`);
        next(error); // Transmettre l'erreur au middleware global
    }
};

module.exports = { getAllUsers, deleteUser };
