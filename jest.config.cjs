module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  testMatch: ['<rootDir>/tests/**/*.test.jsx'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  reporters: [
    'default',
    [
      '<rootDir>/jest-html-report.cjs',
      { outputFile: 'reports/jest-report.html' },
    ],
  ],
  modulePathIgnorePatterns: ['<rootDir>/tests/node_modules/'],
};
