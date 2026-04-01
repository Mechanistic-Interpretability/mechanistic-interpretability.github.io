const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@content-collections/core$': '<rootDir>/test/__mocks__/content-collections.js',
    '^@content-collections/mdx$': '<rootDir>/test/__mocks__/content-collections-mdx.js',
    '^@/lib/.content-collections/generated$': '<rootDir>/test/__mocks__/content-collections-generated.js',
    '^\\.content-collections/generated$': '<rootDir>/test/__mocks__/content-collections-generated.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/page.tsx',
    '!app/**/layout.tsx',
    '!app/**/loading.tsx',
    '!app/**/error.tsx',
    '!app/**/*.stories.tsx',
    '!app/context/**/*.tsx', // Context providers have complex setup
  ],
  coverageThreshold: {
    'app/hooks/**/*.ts': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    'app/lib/**/*.ts': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/coverage/',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);