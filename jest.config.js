module.exports = {
    'globals': {
        VERSION: 'jest-version',
        BUGSNAG_PRODUCTION_API_KEY: '',
        BUGSNAG_STAGING_API_KEY: '',
    },
    'roots': [
        'tests'
    ],
    'preset': 'ts-jest',
    'testEnvironment': 'jsdom',
    'setupFilesAfterEnv': ['<rootDir>/tests/jest.setup.ts'],
    'testMatch': [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    'transform': {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/ts-jest'
    },
    'coverageThreshold': {
        'global': {
            'statements': 80,
            'branches': 80,
            'functions': 80,
            'lines': 80
        }
    },
    'coverageReporters' : ['lcov', 'text', 'text-summary', 'cobertura'],
    'collectCoverageFrom': [
        '**/*.{js,jsx,ts,tsx}',
        'src/**/*.{js,jsx,ts,tsx}',
        'src/components/**/*.{js,jsx,ts,tsx}',
        'src/themes/**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
        '!**/lib/**',
        '!**/tests/**'
    ],
    'testPathIgnorePatterns': [
        '/node_modules/'
    ],
    'modulePaths': [
        '<rootDir>'
    ],
    'moduleNameMapper': {
        '\\.css$': 'identity-obj-proxy',
        'src/(.*)': '<rootDir>/src/$1'
    }
};
