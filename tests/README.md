# Test Suite Documentation

This directory contains comprehensive unit tests for the marketplace application.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   └── services/           # Service layer tests
│       ├── brand_service.spec.ts
│       └── brand_service_focused.spec.ts
├── functional/             # Functional tests for complete workflows
├── integration/            # Integration tests for API endpoints
├── helpers/                # Test utilities and helpers
│   └── test-utils.ts
├── config.ts              # Test configuration
├── bootstrap.ts           # Test bootstrap setup
└── run-unit-tests.ts      # Test runner script
```

## Running Tests

### Run All Tests
```bash
npm test
# or
node ace test
```

### Run Unit Tests Only
```bash
npm run test:unit
# or
node ace test tests/unit/
```

### Run Specific Test File
```bash
node ace test tests/unit/services/brand_service.spec.ts
```

### Run Tests with Coverage
```bash
node ace test --coverage
```

## Test Categories

### Unit Tests (`tests/unit/`)
- **Services**: Test business logic in service classes
- **Models**: Test data validation and relationships
- **Controllers**: Test HTTP request/response handling
- **Middleware**: Test authorization and request processing

### Functional Tests (`tests/functional/`)
- Complete user workflows
- API endpoint testing
- Integration between components

### Integration Tests (`tests/integration/`)
- Database interactions
- External service integrations
- End-to-end scenarios

## BrandService Tests

The BrandService tests cover:

### Core Functionality
- ✅ Create new brands
- ✅ Prevent duplicate brand creation
- ✅ Retrieve all brands
- ✅ Update existing brands
- ✅ Delete brands

### Edge Cases
- ✅ Handle non-existent brand updates/deletions
- ✅ Case-insensitive brand name handling
- ✅ Special characters in brand names
- ✅ Long brand names
- ✅ Concurrent brand creation

### Data Integrity
- ✅ Preserve ID and timestamps during updates
- ✅ Maintain referential integrity
- ✅ Handle database constraints

## Test Utilities

The `TestUtils` class provides helper methods for:

- Creating test data (brands, users, products, deals)
- Cleaning up test data
- Setting up test scenarios
- Managing test isolation

## Writing New Tests

### Service Tests
```typescript
import { test } from '@japa/runner'
import { YourService } from '#services/your_service'
import { TestUtils } from '../../helpers/test-utils'

test.group('YourService', (group) => {
  let service: YourService

  group.setup(async () => {
    service = new YourService()
  })

  group.teardown(async () => {
    await TestUtils.cleanup()
  })

  test('should perform expected action', async ({ assert }) => {
    // Arrange
    const testData = await TestUtils.createTestData()
    
    // Act
    const result = await service.performAction(testData)
    
    // Assert
    assert.equal(result.expected, 'value')
  })
})
```

### Best Practices
1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Naming**: Use descriptive test names
4. **Structure**: Follow Arrange-Act-Assert pattern
5. **Coverage**: Test both happy path and edge cases

## Test Data Management

- Use `TestUtils` for creating test data
- Always clean up after tests
- Use unique identifiers to avoid conflicts
- Mock external dependencies when needed

## Continuous Integration

Tests are automatically run in CI/CD pipeline:
- All unit tests must pass
- Coverage threshold: 80%
- No linting errors allowed
- Database migrations must be up to date
