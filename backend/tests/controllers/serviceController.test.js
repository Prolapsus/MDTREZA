const request = require('supertest');
const app = require('../../server'); // L'entrée principale de votre application
const { Service } = require('../../models');

// Mock des modèles Sequelize
jest.mock('../../models', () => ({
    Service: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Service Controller', () => {
    describe('getAllServices', () => {
        it('devrait retourner la liste de tous les services', async () => {
            const mockServices = [
                {
                    id: 1,
                    nom: 'Massage relaxant',
                    description: 'Un massage complet du corps, conçu pour éliminer les tensions et apporter une relaxation profonde. Parfait pour se détendre après une journée stressante.',
                    prix: 78,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-31T00:00:00.000Z',
                },
                {
                    id: 2,
                    nom: 'Soins du visage',
                    description: 'Un soin du visage personnalisé utilisant des produits naturels pour purifier et revitaliser la peau, redonnant éclat et douceur.',
                    prix: 96,
                    createdAt: '2023-01-11T00:00:00.000Z',
                    updatedAt: '2023-02-10T00:00:00.000Z',
                },
            ];

            Service.findAll.mockResolvedValue(mockServices);

            const res = await request(app).get('/api/services');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockServices);
        });
    });

    describe('getServiceById', () => {
        it('devrait retourner un service si l\'ID est valide', async () => {
            const mockService = {
                id: 1,
                nom: 'Massage relaxant',
                description: 'Un massage complet du corps, conçu pour éliminer les tensions et apporter une relaxation profonde.',
                prix: 78,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-31T00:00:00.000Z',
            };

            Service.findByPk.mockResolvedValue(mockService);

            const res = await request(app).get('/api/services/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockService);
        });

        it('devrait retourner une erreur si le service n\'existe pas', async () => {
            Service.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/api/services/999');

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('Service non trouvé');
        });
    });
});
