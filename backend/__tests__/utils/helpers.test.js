const helper = require('../../utils/helpers');

describe('Helper Functions', () => {
  describe('camelToSnake', () => {
    test('should convert camelCase to snake_case', () => {
      const input = { camelCase: 'value', anotherKey: 'anotherValue' };
      const expected = { camel_case: 'value', another_key: 'anotherValue' };

      const result = helper.camelToSnake(input);

      expect(result).toEqual(expected);
    });

    test('should handle empty objects', () => {
      const input = {};
      const expected = {};

      const result = helper.camelToSnake(input);

      expect(result).toEqual(expected);
    });

    test('should handle undefined value', () => {
      const input = { simpleKey: undefined };
      const expected = { simple_key: undefined };

      const result = helper.camelToSnake(input);

      expect(result).toEqual(expected);
    });
  });

  describe('snakeToCamel', () => {
    test('should convert snake_case to camelCase', () => {
      const input = { snake_case: 'value', another_key: 'anotherValue' };
      const expected = { snakeCase: 'value', anotherKey: 'anotherValue' };

      const result = helper.snakeToCamel(input);

      expect(result).toEqual(expected);
    });

    test('should handle empty objects', () => {
      const input = {};
      const expected = {};

      const result = helper.snakeToCamel(input);

      expect(result).toEqual(expected);
    });

    test('should handle undefined value', () => {
      const input = { single_key: undefined };
      const expected = { singleKey: undefined };

      const result = helper.snakeToCamel(input);

      expect(result).toEqual(expected);
    });
  });
});
