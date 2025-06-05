// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Collect coverage information
  collectCoverage: true,

  // Collect coverage from
  collectCoverageFrom: [
    'src/classes/**/*.ts',
    'src/services/**/*.ts',
  ],

  // Explicitly ignore these folders entirely:
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/connections/',  // ignore mongo.conn.ts
    '/src/models/',       // ignore your Mongoose model file
    // '/src/services/'      // ignore PricingService (until you write tests for it)
  ],

  // Where to output coverage reports
  coverageDirectory: 'coverage',

  // Report formats: text summary in console + HTML
  coverageReporters: ['text', 'lcov'],

  // You can add thresholds if you want to enforce minimum coverage:
  coverageThreshold: {
    global: {
      branches:  90,
      functions: 90,
      lines:     90,
      statements: 90,
    },
    // You can also set per‐file thresholds:
    // "src/someFile.ts": { branches: 90, lines: 90, ... }
  },

  // If you have path‐aliases, ensure moduleNameMapper is still there:
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },  
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.ts'],
};
