#!/usr/bin/env node

/**
 * Simple script to run unit tests for BrandService
 * Usage: node tests/run-unit-tests.ts
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runTests() {
  try {
    console.log('🧪 Running BrandService unit tests...\n')
    
    // Run the specific BrandService tests
    const { stdout, stderr } = await execAsync('node ace test tests/unit/services/brand_service.spec.ts')
    
    console.log(stdout)
    if (stderr) {
      console.error(stderr)
    }
    
    console.log('\n✅ BrandService tests completed!')
  } catch (error) {
    console.error('❌ Test execution failed:', error.message)
    process.exit(1)
  }
}

runTests()
