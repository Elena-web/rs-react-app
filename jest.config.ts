import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  //setupFilesAfterEnv: ['./jest.setup.ts'], // обязательно создай файл с импортом jest-dom
  testMatch: ['**/*.test.tsx', '**/*.spec.tsx'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'json', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
      functions: 50,
      lines: 50,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/index.tsx',
    '<rootDir>/src/setupTests.ts',
    '\\.d\\.ts$',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};

export default config;
