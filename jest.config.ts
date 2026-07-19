import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { module: 'commonjs' } }]
  },
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api',
    '^@utils-types$': '<rootDir>/src/utils/types'
  }
};

export default config;