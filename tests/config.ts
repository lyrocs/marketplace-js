import { configure } from '@japa/runner'
import { fileSystem } from '@japa/file-system'
import { specReporter } from '@japa/spec-reporter'

/**
 * Configure test suites and reporters
 */
configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [fileSystem()],
  reporters: [specReporter()],
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
