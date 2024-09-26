const Joi = require('joi');
const Service = require('../models/Service');
const logger = require('../config/logger'); // Importation de Winston pour les logs

// Schéma de validation avec Joi pour les services
const serviceSchema = Joi.object({
    nom: Joi.string().trim().required().messages({
        'string.empty': 'Le nom est obligatoire',
    }),
    description: Joi.string().trim().required().messages({
        'string.empty': 'La description est obligatoire',
    }),
    prix: Joi.number().positive().required().messages({
        'number.base': 'Le prix doit être un nombre',
        'number.positive': 'Le prix doit être un nombre positif',
        'any.required': 'Le prix est obligatoire',
    }),
});

// Obtenir tous les services
const getAllServices = async (req, res, next) => {
    try {
        const services = await Service.findAll();
        logger.info('Tous les services ont été récupérés');
        res.json(services);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des services : ${error.message}`);
        next(error);
    }
};

// Obtenir un service par son ID
const getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (service) {
            logger.info(`Service récupéré avec l'ID : ${req.params.id}`);
            res.json(service);
        } else {
            logger.warn(`Service non trouvé avec l'ID : ${req.params.id}`);
            res.status(404).json({ message: 'Service non trouvé' });
        }
    } catch (error) {
        logger.error(`Erreur lors de la récupération du service avec l'ID ${req.params.id} : ${error.message}`);
        next(error);
    }
};

// Ajouter un service (admin uniquement) avec validation via Joi
const addService = async (req, res, next) => {
    const { error } = serviceSchema.validate(req.body);
    if (error) {
        logger.warn(`Erreur de validation lors de l'ajout d'un service : ${error.details[0].message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { nom, description, prix } = req.body;

    try {
        const newService = await Service.create({
            nom: nom.trim(),
            description: description.trim(),
            prix: parseFloat(prix)
        });
        logger.info(`Nouveau service créé : ${newService.id} (${newService.nom})`);
        res.status(201).json(newService);
    } catch (error) {
        logger.error(`Erreur lors de l'ajout du service : ${error.message}`);
        next(error);
    }
};

// Modifier un service (admin uniquement) avec validation via Joi
const updateService = async (req, res, next) => {
    const { error } = serviceSchema.validate(req.body);
    if (error) {
        logger.warn(`Erreur de validation lors de la modification du service : ${error.details[0].message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { nom, description, prix } = req.body;

    try {
        const service = await Service.findByPk(req.params.id);
        if (service) {
            service.nom = nom || service.nom;
            service.description = description || service.description;
            service.prix = prix || service.prix;

            await service.save();
            logger.info(`Service mis à jour : ${service.id} (${service.nom})`);
            res.json(service);
        } else {
            logger.warn(`Service non trouvé pour l'ID : ${req.params.id}`);
            res.status(404).json({ message: 'Service non trouvé' });
        }
    } catch (error) {
        logger.error(`Erreur lors de la mise à jour du service avec l'ID ${req.params.id} : ${error.message}`);
        next(error);
    }
};

// Supprimer un service (admin uniquement)
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (service) {
            await service.destroy();
            logger.info(`Service supprimé : ${service.id} (${service.nom})`);
            res.json({ message: 'Service supprimé' });
        } else {
            logger.warn(`Service non trouvé pour l'ID : ${req.params.id}`);
            res.status(404).json({ message: 'Service non trouvé' });
        }
    } catch (error) {
        logger.error(`Erreur lors de la suppression du service avec l'ID ${req.params.id} : ${error.message}`);
        next(error);
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    addService,
    updateService,
    deleteService
};
