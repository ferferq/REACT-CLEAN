module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}', 
    '!<rootDir>/src/main/**/*', 
    '!<rootDir>/src/**/index.ts', 
    '!<rootDir>/src/infra/router/*', 
    '!<rootDir>/src/presentation/pages/app/*', 
    '!**/*.d.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/main/test/cypress/'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/main/config/jest-step.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.scss': 'identity-obj-proxy',
  },
};
