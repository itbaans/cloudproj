const express = require('express');
const request = require('supertest');
const { getUserInfo } = require('../controllers/profileController.js');
const userModel = require('../models/userModel.js');

// Mock the userModel module
jest.mock('../models/userModel.js');

const app = express();

// Middleware to simulate authenticated request
app.use((req, res, next) => {
  req.user = { userId: 123 }; // mock user ID
  next();
});

app.get('/user', getUserInfo);

describe('GET /user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user info when user exists', async () => {
    const mockUser = { id: 123, name: 'John Doe', email: 'john@example.com' };

    userModel.findUserByUserId.mockResolvedValue(mockUser);

    const res = await request(app).get('/user');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
    expect(userModel.findUserByUserId).toHaveBeenCalledWith(123);
  });

  it('should return 404 when user is not found', async () => {
    userModel.findUserByUserId.mockResolvedValue(null);

    const res = await request(app).get('/user');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  it('should return 500 on server error', async () => {
    userModel.findUserByUserId.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/user');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error.');
  });
});
