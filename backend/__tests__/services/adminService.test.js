const adminModel = require('../../models/adminModel');
const adminService = require('../../services/adminService');

// Mock the adminModel
jest.mock('../../models/adminModel');

describe('adminService', () => {
  describe('checkAdmin', () => {
    it('should return admin data if credentials are correct', async () => {
      // Mock the return value of getAdminByUserPass
      const mockAdminData = {
        id: 1,
        username: 'admin',
        password: 'password123',
      };
      adminModel.getAdminByUserPass.mockResolvedValue(mockAdminData);

      const username = 'admin';
      const password = 'password123';
      const result = await adminService.checkAdmin(username, password);

      expect(result).toEqual(mockAdminData); // Expect the result to be the mock data
      expect(adminModel.getAdminByUserPass).toHaveBeenCalledWith(
        username,
        password
      ); // Check the correct parameters
    });

    it('should return null if credentials are incorrect', async () => {
      // Mock the return value for incorrect credentials
      adminModel.getAdminByUserPass.mockResolvedValue(null);

      const username = 'wrongUser';
      const password = 'wrongPassword';
      const result = await adminService.checkAdmin(username, password);

      expect(result).toBeNull(); // Expect the result to be null
      expect(adminModel.getAdminByUserPass).toHaveBeenCalledWith(
        username,
        password
      ); // Check the correct parameters
    });

    it('should handle errors gracefully', async () => {
      // Mock the function to throw an error
      adminModel.getAdminByUserPass.mockRejectedValue(
        new Error('Database error')
      );

      const username = 'admin';
      const password = 'password123';
      await expect(adminService.checkAdmin(username, password)).rejects.toThrow(
        'Database error'
      ); // Expect the error to be thrown
    });
  });
});
