module.exports = {
    testEnvironment: 'jsdom',
  
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
  
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  
    modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  
    watchPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
  
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}', '!<rootDir>/node_modules/'],
  };
  
