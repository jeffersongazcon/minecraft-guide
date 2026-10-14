module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  testMatch: ['<rootDir>/tests/**/*.test.jsx'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/tests/node_modules/'],
};
