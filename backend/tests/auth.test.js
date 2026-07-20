process.env.JWT_SECRET = 'test-secret';

const mockUsers = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
};

jest.mock('../models', () => ({
    Users: mockUsers,
    Courses: { findAll: jest.fn() },
    UsersCourses: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn() }
}));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');

describe('authentication', () => {
    beforeEach(() => jest.clearAllMocks());

    test('rejects a login without credentials', async () => {
        const response = await request(app).post('/login').send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email is required!');
    });

    test('returns a JWT for valid credentials without exposing the password', async () => {
        const password = await bcrypt.hash('1234', 4);
        mockUsers.findOne.mockResolvedValue({
            studentID: 'student-1',
            email: 'admin@example.com',
            password,
            isAdmin: true,
            toJSON() {
                return { ...this, toJSON: undefined };
            }
        });

        const response = await request(app)
            .post('/login')
            .send({ email: 'admin@example.com', password: '1234' });

        expect(response.status).toBe(200);
        expect(response.body.data.user.password).toBeUndefined();
        expect(jwt.verify(response.body.data.token, 'test-secret')).toMatchObject({
            id: 'student-1',
            isAdmin: true
        });
    });

    test('rejects an invalid password', async () => {
        mockUsers.findOne.mockResolvedValue({
            password: await bcrypt.hash('correct-password', 4)
        });

        const response = await request(app)
            .post('/login')
            .send({ email: 'student@example.com', password: 'wrong-password' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Password is incorrect!');
    });

    test('protects private routes when the token is missing or invalid', async () => {
        const [missing, invalid] = await Promise.all([
            request(app).get('/users'),
            request(app).get('/users').set('Authorization', 'Bearer invalid-token')
        ]);

        expect(missing.status).toBe(401);
        expect(invalid.status).toBe(401);
    });
});
