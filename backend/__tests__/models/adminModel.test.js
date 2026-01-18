const adminModel = require('../../models/adminModel'); // Adjust the path as necessary
const pool = require('../../config/database'); // Adjust the path as necessary

jest.mock('../../config/database'); // Mock the database module

describe('adminModel', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks
  });

  test('getAllAdmins should return all admins', async () => {
    const mockRows = [
      { id: 1, username: 'admin1' },
      { id: 2, username: 'admin2' },
    ];
    pool.query.mockResolvedValueOnce({ rows: mockRows }); // Mock implementation

    const admins = await adminModel.getAllAdmins();
    expect(admins).toEqual(mockRows);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM admins'); // Ensure the correct query was called
  });

  test('getAdminById should return admin with given id', async () => {
    const mockAdmin = { id: 1, username: 'admin1' };
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] });

    const admin = await adminModel.getAdminById(1);
    expect(admin).toEqual(mockAdmin);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM admins WHERE id = $1',
      [1]
    );
  });

  test('getAdminByUserPass should return admin for valid credentials', async () => {
    const mockAdmin = { id: 1, username: 'admin1' };
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] });

    const admin = await adminModel.getAdminByUserPass('admin1', 'password123');
    expect(admin).toEqual(mockAdmin);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM admins WHERE username=$1 AND password=$2',
      ['admin1', 'password123']
    );
  });

  test('createAdmin should insert a new admin and return it', async () => {
    const mockAdmin = { id: 1, username: 'admin1' };
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] });

    const admin = await adminModel.createAdmin('admin1', 'password123');
    expect(admin).toEqual(mockAdmin);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *',
      ['admin1', 'password123']
    );
  });

  test('updateAdmin should update an admin and return the updated admin', async () => {
    const mockAdmin = { id: 1, username: 'admin1' };
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] });

    const admin = await adminModel.updateAdmin(1, 'admin1', 'newpassword');
    expect(admin).toEqual(mockAdmin);
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE admins SET username = $1, password = $2 WHERE id = $3 RETURNING *',
      ['admin1', 'newpassword', 1]
    );
  });

  test('deleteAdmin should delete an admin and return the deleted admin', async () => {
    const mockAdmin = { id: 1, username: 'admin1' };
    pool.query.mockResolvedValueOnce({ rows: [mockAdmin] });

    const admin = await adminModel.deleteAdmin(1);
    expect(admin).toEqual(mockAdmin);
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM admins WHERE id = $1 RETURNING *',
      [1]
    );
  });
});
