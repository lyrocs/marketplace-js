import { configure } from '@japa/runner'

/**
 * Configure test suites and reporters
 */
configure({
  files: ['tests/**/*.spec.ts'],
  reporters: {
    activated: ['spec'],
  },
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.ts'],
      timeout: 5000
    },
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.ts'],
      timeout: 10000
    },
    {
      name: 'integration',
      files: ['tests/integration/**/*.spec.ts'],
      timeout: 15000
    }
  ],
  timeout: 10000
})
