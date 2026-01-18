const adminModel = require('../models/adminModel');
const adminService = require('../services/adminService');
const jwtService = require('../services/jwtService');

const adminController = {
  getAllAdmins: async (req, res) => {
    try {
      const admins = await adminModel.getAllAdmins();
      res.json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAdminById: async (req, res) => {
    try {
      const admin = await adminModel.getAdminById(req.params.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createAdmin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const newAdmin = await adminModel.createAdmin(username, password);
      res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateAdmin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const updatedAdmin = await adminModel.updateAdmin(
        req.params.id,
        username,
        password
      );
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(updatedAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const deletedAdmin = await adminModel.deleteAdmin(req.params.id);
      if (!deletedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(deletedAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await adminService.checkAdmin(username, password);

      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const adminInfo = {
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
      };

      const accessToken = jwtService.generateAccessToken(adminInfo);
      const refreshToken = jwtService.generateRefreshToken(adminInfo);

      // Set cookie with the token
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: false }); // Set secure: true in production
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
      }); // Set secure: true in production
      res.status(200).json(adminInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  logoutAdmin: async (req, res) => {
    try {
      res.clearCookie('accessToken', { httpOnly: true });
      res.clearCookie('refreshToken', { httpOnly: true });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  refreshToken: (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const accessToken =
        jwtService.generateAccessTokenFromRefreshToken(refreshToken);
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: false }); // Set secure: true in production
      return res.status(200).json({ message: 'Ok' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  verifyAdmin: (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const logged = jwtService.verifyRefreshToken(refreshToken);

      if (!logged) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { id, username, full_name } = logged;

      return res.status(200).json({ id, username, full_name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = adminController;
