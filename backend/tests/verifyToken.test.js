const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const httpMocks = require('node-mocks-http');
const logger = require('../utils/logger');
require("dotenv").config();


// mock logger to suppress actual log output during test
jest.mock('../utils/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

describe('verifyToken middleware', () => {
  const mockUser = { userId: 123 };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/notes',
      headers: {}, // No Authorization
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Access denied. No token provided.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/notes',
      headers: {
        authorization: 'Bearer invalid.token.value',
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ error: 'Invalid or expired token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() and attach user if token is valid', () => {
    const token = jwt.sign(mockUser, process.env.JWT_SECRET);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/notes',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(req.user).toMatchObject(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res._isEndCalled()).toBe(false); // No response sent, means it passed to next()
  });
});
