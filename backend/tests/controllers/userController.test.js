const request = require('supertest');
const app = require('../../server'); // Le point d'entrée principal de l'application
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

// Mock de la base de données
jest.mock('../../models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

describe('User Controller', () => {
    describe('registerUser', () => {
        it('devrait créer un nouvel utilisateur si les données sont valides', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    prenom: 'John',
                    nom: 'Doe',
                    dateNaissance: '1990-01-01',
                    adresse: '123 rue principale',
                    codePostal: '75000',
                    ville: 'Paris',
                    email: 'newuser@example.com',
                    password: 'ValidPassword123!',
                });

            console.log(res.body);  // Affiche le corps de la réponse pour déboguer
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('token');
        });


        it('devrait retourner une erreur si l\'email est déjà utilisé', async () => {
            User.findOne.mockResolvedValue(true); // Simuler un utilisateur déjà existant

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    prenom: 'John',
                    nom: 'Doe',
                    dateNaissance: '1990-01-01',
                    adresse: '123 rue principale',
                    codePostal: '75000',
                    ville: 'Paris',
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Cet utilisateur existe déjà.');
        });
    });

    describe('loginUser', () => {
        it('devrait connecter un utilisateur avec des informations valides', async () => {
            const mockUser = {
                id: 1,
                prenom: 'John',
                nom: 'Doe',
                email: 'johndoe@example.com',
                password: 'password123', // Mot de passe haché
            };

            User.findOne.mockResolvedValue(mockUser); // Simuler la recherche de l'utilisateur
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Simuler la correspondance du mot de passe

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('devrait retourner une erreur si les informations de connexion sont incorrectes', async () => {
            // Mock de la recherche d'utilisateur avec un email incorrect
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'wrongemail@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Email ou mot de passe incorrect');
        });

    });
});
