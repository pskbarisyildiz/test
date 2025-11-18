module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    "**/test/**/*.test.ts",
    "**/test/**/*-test.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/src/"
  ],
  roots: [
    "<rootDir>/test"
  ]
};
