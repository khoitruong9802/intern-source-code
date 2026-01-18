const { validateAdmin } = require('../../validations/adminValidator');

describe('Admin Validation', () => {
  test('should validate valid admin data', () => {
    const validData = {
      username: 'validUser',
      password: 'validPassword123',
    };

    const { error } = validateAdmin(validData);
    expect(error).toBeUndefined(); // Should not have any error
  });

  test('should fail when username is too short', () => {
    const invalidData = {
      username: 'user',
      password: 'validPassword123',
    };

    const { error } = validateAdmin(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"username" length must be at least 6 characters long'
    );
  });

  test('should fail when password is too short', () => {
    const invalidData = {
      username: 'validUser',
      password: '123',
    };

    const { error } = validateAdmin(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"password" length must be at least 6 characters long'
    );
  });

  test('shoul fail when fields are midssing', () => {
    const invalidData = {
      username: 'validUser',
    };

    const { error } = validateAdmin(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe('"password" is required');
  });

  test('should fail when username is too long', () => {
    const invalidData = {
      username: 'a'.repeat(255), // 255 characters long
      password: 'validPassword123',
    };

    const { error } = validateAdmin(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"username" length must be less than or equal to 254 characters long'
    );
  });

  test('should fail when password is too long', () => {
    const invalidData = {
      username: 'validUser',
      password: 'a'.repeat(255), // 255 characters long
    };

    const { error } = validateAdmin(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"password" length must be less than or equal to 254 characters long'
    );
  });
});
