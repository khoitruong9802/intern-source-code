const { authMiddleware } = require('../../middleware/auth'); // Adjust path as needed
const { verifyAccessToken } = require('../../services/jwtService');

jest.mock('../../services/jwtService'); // Mock the jwtService module

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {
        accessToken: 'mockAccessToken', // Mock access token
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn(); // Mock the next function
  });

  test('should call next() when token is valid', () => {
    // Arrange: Mock the behavior of verifyAccessToken
    verifyAccessToken.mockReturnValue({ userId: 1, role: 'admin' });

    // Act: Call the middleware
    authMiddleware(req, res, next);

    // Assert: Check that next() was called
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // Ensure response was not sent
  });

  test('should return 401 when token is invalid', () => {
    // Arrange: Mock an error thrown by verifyAccessToken
    verifyAccessToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act: Call the middleware
    authMiddleware(req, res, next);

    // Assert: Check that the response status is set to 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled(); // Ensure next() was not called
  });

  test('should return 401 when accessToken is missing', () => {
    // Arrange: Remove the accessToken from req.cookies
    req.cookies.accessToken = undefined;

    // Act: Call the middleware
    authMiddleware(req, res, next);

    // Assert: Check that the response status is set to 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled(); // Ensure next() was not called
  });
});
