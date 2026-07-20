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

const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');

const user = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    password: 'temporary-password',
    birthDay: '1815-12-10'
};

describe('role authorization', () => {
    beforeEach(() => jest.clearAllMocks());

    test('forbids a student from creating users', async () => {
        const token = jwt.sign({ id: 'student-1', isAdmin: false }, 'test-secret');

        const response = await request(app)
            .post('/users/create')
            .set('Authorization', `Bearer ${token}`)
            .send(user);

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Admin authority required!');
        expect(mockUsers.create).not.toHaveBeenCalled();
    });

    test('allows an admin to create users', async () => {
        const token = jwt.sign({ id: 'admin-1', isAdmin: true }, 'test-secret');
        mockUsers.create.mockImplementation(async values => values);

        const response = await request(app)
            .post('/users/create')
            .set('Authorization', `Bearer ${token}`)
            .send(user);

        expect(response.status).toBe(200);
        expect(response.body.data.password).toBeUndefined();
        expect(mockUsers.create).toHaveBeenCalledWith(expect.objectContaining({
            email: user.email,
            isAdmin: false
        }));
    });
});
