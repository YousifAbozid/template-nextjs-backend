import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured when using Next.js plugin)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'app/api/**/*.js',
    'middleware/**/*.js',
    'lib/**/*.js',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
export default createJestConfig(customJestConfig);
