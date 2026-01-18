const helper = {
  // Function to convert camelCase to snake_case
  camelToSnake: (obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([A-Z])/g, '_$1').toLowerCase(),
        value,
      ])
    );
  },

  // Function to convert snake_case to camelCase
  snakeToCamel: (obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/(_\w)/g, (m) => m[1].toUpperCase()),
        value,
      ])
    );
  },
};

module.exports = helper;
