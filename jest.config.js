// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageProvider: 'v8',
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1'
  },
  resetMocks: true,
  testMatch: [
    "**/__tests__/**/*.spec.[jt]s?(x)"
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.tsx?$': 'ts-jest'
  }
};
