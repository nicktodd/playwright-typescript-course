# Lab: REST API Testing with Playwright and TypeScript

## Overview
In this lab, you will create a Playwright project from scratch to test a REST API. You'll learn how to perform basic CRUD (Create, Read, Update, Delete) operations using HTTP requests and verify the responses using Playwright's testing framework.

## Prerequisites
- Node.js installed (version 18 or higher)
- A code editor (VS Code recommended)
- Basic understanding of TypeScript/JavaScript
- Basic understanding of REST APIs and HTTP methods

## Learning Objectives
By the end of this lab, you will be able to:
- Set up a new Playwright project with TypeScript
- Configure Playwright for API testing
- Write tests for GET, POST, PUT, and DELETE operations
- Use assertions to verify API responses
- Handle different response types (JSON, text)
- Work with query parameters and request headers

## Lab Setup

### Step 1: Create a New Project Directory

Create a new directory for your project and navigate into it:

**Windows (PowerShell):**
```powershell
mkdir api-testing-lab
cd api-testing-lab
```

**macOS/Linux (Terminal):**
```bash
mkdir api-testing-lab
cd api-testing-lab
```

### Step 2: Initialize a Node.js Project

Initialize a new Node.js project:

```bash
npm init -y
```

This creates a `package.json` file with default settings.

### Step 3: Install Playwright

Install Playwright and its dependencies:

```bash
npm install -D @playwright/test
```

Install the Playwright browsers:

```bash
npx playwright install
```

### Step 4: Install TypeScript Support

Install TypeScript and Node.js type definitions:

```bash
npm install -D @types/node typescript
```

### Step 5: Create Project Structure

Create the following directory structure:

**Windows (PowerShell):**
```powershell
mkdir tests
New-Item -ItemType File -Name "playwright.config.ts"
New-Item -ItemType File -Name "tsconfig.json"
```

**macOS/Linux (Terminal):**
```bash
mkdir tests
touch playwright.config.ts
touch tsconfig.json
```

## Configuration

### Step 6: Configure TypeScript

Open `tsconfig.json` and add the following configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": ["tests/**/*", "playwright.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 7: Configure Playwright

Open `playwright.config.ts` and add the following configuration:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL for API requests - we'll use JSONPlaceholder for this lab */
    baseURL: 'https://jsonplaceholder.typicode.com',
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers (though we'll focus on API testing) */
  projects: [
    {
      name: 'api-tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

**Note:** We're using JSONPlaceholder (https://jsonplaceholder.typicode.com) as our test API. It's a free fake REST API for testing and prototyping.

### Step 8: Update package.json Scripts

Open `package.json` and add the following scripts section:

```json
{
  "name": "api-testing-lab",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "report": "npx playwright show-report"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@playwright/test": "^1.54.2",
    "@types/node": "^24.2.1",
    "typescript": "^5.0.0"
  }
}
```

## Writing Your First API Tests

### Step 9: Create Your First Test File

Create a new file `tests/api-crud.test.ts` and add the following basic structure:

```typescript
import { test, expect } from '@playwright/test';

// We'll add our tests here in the following steps
```

### Step 10: Write a GET Request Test

Add the following test to fetch all posts:

```typescript
import { test, expect } from '@playwright/test';

test.describe('JSONPlaceholder API Tests', () => {
  
  test('GET /posts - should return all posts', async ({ request }) => {
    // Make a GET request to the /posts endpoint
    const response = await request.get('/posts');
    
    // Verify the response status
    expect(response.status()).toBe(200);
    
    // Parse the JSON response
    const posts = await response.json();
    
    // Verify the response structure
    expect(posts).toEqual(expect.any(Array));
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify the first post has the expected properties
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
    expect(posts[0]).toHaveProperty('userId');
  });

});
```

### Step 11: Test Your First Test

Run your test to make sure everything is working:

```bash
npm test
```

You should see output indicating that your test passed. If there are any errors, check your configuration files.

### Step 12: Write a GET by ID Test

Add another test to fetch a specific post by ID:

```typescript
  test('GET /posts/1 - should return a specific post', async ({ request }) => {
    // Make a GET request to fetch post with ID 1
    const response = await request.get('/posts/1');
    
    // Verify the response status
    expect(response.status()).toBe(200);
    
    // Parse the JSON response
    const post = await response.json();
    
    // Verify the specific post data
    expect(post.id).toBe(1);
    expect(post.title).toBeTruthy();
    expect(post.body).toBeTruthy();
    expect(post.userId).toBeTruthy();
  });
```

### Step 13: Write a GET with Query Parameters Test

Add a test that uses query parameters:

```typescript
  test('GET /posts with query params - should filter posts by userId', async ({ request }) => {
    // Make a GET request with query parameters
    const response = await request.get('/posts', {
      params: { userId: '1' }
    });
    
    // Verify the response status
    expect(response.status()).toBe(200);
    
    // Parse the JSON response
    const posts = await response.json();
    
    // Verify all posts belong to userId 1
    expect(posts).toEqual(expect.any(Array));
    posts.forEach((post: any) => {
      expect(post.userId).toBe(1);
    });
  });
```

### Step 14: Write a POST Request Test

Add a test to create a new post:

```typescript
  test('POST /posts - should create a new post', async ({ request }) => {
    // Define the new post data
    const newPost = {
      title: 'My New Post',
      body: 'This is the content of my new post',
      userId: 1
    };
    
    // Make a POST request to create a new post
    const response = await request.post('/posts', {
      data: newPost
    });
    
    // Verify the response status (JSONPlaceholder returns 201 for created)
    expect(response.status()).toBe(201);
    
    // Parse the JSON response
    const createdPost = await response.json();
    
    // Verify the created post contains our data
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost.id).toBeTruthy(); // Should have an ID assigned
  });
```

### Step 15: Write a PUT Request Test

Add a test to update an existing post:

```typescript
  test('PUT /posts/1 - should update an existing post', async ({ request }) => {
    // Define the updated post data
    const updatedPost = {
      id: 1,
      title: 'Updated Post Title',
      body: 'This post has been updated',
      userId: 1
    };
    
    // Make a PUT request to update the post
    const response = await request.put('/posts/1', {
      data: updatedPost
    });
    
    // Verify the response status
    expect(response.status()).toBe(200);
    
    // Parse the JSON response
    const responsePost = await response.json();
    
    // Verify the updated post data
    expect(responsePost.id).toBe(1);
    expect(responsePost.title).toBe(updatedPost.title);
    expect(responsePost.body).toBe(updatedPost.body);
    expect(responsePost.userId).toBe(updatedPost.userId);
  });
```

### Step 16: Write a PATCH Request Test

Add a test to partially update a post:

```typescript
  test('PATCH /posts/1 - should partially update an existing post', async ({ request }) => {
    // Define partial update data
    const partialUpdate = {
      title: 'Partially Updated Title'
    };
    
    // Make a PATCH request to partially update the post
    const response = await request.patch('/posts/1', {
      data: partialUpdate
    });
    
    // Verify the response status
    expect(response.status()).toBe(200);
    
    // Parse the JSON response
    const responsePost = await response.json();
    
    // Verify the title was updated while other fields remain
    expect(responsePost.title).toBe(partialUpdate.title);
    expect(responsePost.id).toBe(1);
    expect(responsePost.body).toBeTruthy(); // Should still exist
    expect(responsePost.userId).toBeTruthy(); // Should still exist
  });
```

### Step 17: Write a DELETE Request Test

Add a test to delete a post:

```typescript
  test('DELETE /posts/1 - should delete an existing post', async ({ request }) => {
    // Make a DELETE request to remove the post
    const response = await request.delete('/posts/1');
    
    // Verify the response status (JSONPlaceholder returns 200 for delete)
    expect(response.status()).toBe(200);
    
    // For some APIs, you might expect a 204 No Content status instead
    // expect(response.status()).toBe(204);
  });
```

### Step 18: Write a Test with Custom Headers

Add a test that demonstrates using custom headers:

```typescript
  test('GET /posts with custom headers - should handle authentication', async ({ request }) => {
    // Make a GET request with custom headers
    const response = await request.get('/posts/1', {
      headers: {
        'Authorization': 'Bearer fake-token-for-demo',
        'Accept': 'application/json',
        'User-Agent': 'PlaywrightTestAgent/1.0'
      }
    });
    
    // Verify the response status
    expect(response.status()).toBe(200);
    
    // Parse the JSON response
    const post = await response.json();
    
    // Verify we got the expected post
    expect(post.id).toBe(1);
  });
```

### Step 19: Write a Test for Error Handling

Add a test to handle error scenarios:

```typescript
  test('GET /posts/9999 - should handle not found error', async ({ request }) => {
    // Make a GET request for a non-existent post
    const response = await request.get('/posts/9999');
    
    // JSONPlaceholder returns 404 for non-existent resources
    expect(response.status()).toBe(404);
    
    // Verify the response body is empty or contains error information
    const responseBody = await response.json();
    expect(responseBody).toEqual({});
  });
```

### Step 20: Run All Your Tests

Run all your tests to make sure they pass:

```bash
npm test
```

To see the tests run in a browser (headed mode):

```bash
npm run test:headed
```

To view the HTML report:

```bash
npm run report
```

## Advanced Topics

### Step 21: Add Response Time Testing

Add a test that verifies response time:

```typescript
  test('GET /posts - should respond within reasonable time', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.get('/posts');
    
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
    
    console.log(`Response time: ${responseTime}ms`);
  });
```

### Step 22: Add JSON Schema Validation

Install a JSON schema validation library:

```bash
npm install -D ajv
```

Create a test with schema validation:

```typescript
import Ajv from 'ajv';

  test('GET /posts/1 - should match expected JSON schema', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);
    
    const post = await response.json();
    
    // Define the expected schema for a post
    const postSchema = {
      type: 'object',
      required: ['id', 'title', 'body', 'userId'],
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        body: { type: 'string' },
        userId: { type: 'number' }
      }
    };
    
    // Validate the response against the schema
    const ajv = new Ajv();
    const validate = ajv.compile(postSchema);
    const isValid = validate(post);
    
    expect(isValid).toBe(true);
    if (!isValid) {
      console.log('Validation errors:', validate.errors);
    }
  });
```

### Step 23: Create a Test Data Helper

Create a file `tests/helpers/testData.ts`:

```typescript
export const createTestPost = () => ({
  title: `Test Post ${Date.now()}`,
  body: 'This is a test post created for API testing',
  userId: Math.floor(Math.random() * 10) + 1
});

export const createTestUser = () => ({
  name: 'Test User',
  username: `testuser${Date.now()}`,
  email: `test${Date.now()}@example.com`,
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org'
});
```

Use the helper in your tests:

```typescript
import { createTestPost } from './helpers/testData';

  test('POST /posts - should create post with helper data', async ({ request }) => {
    const newPost = createTestPost();
    
    const response = await request.post('/posts', {
      data: newPost
    });
    
    expect(response.status()).toBe(201);
    
    const createdPost = await response.json();
    expect(createdPost.title).toBe(newPost.title);
  });
```

## Best Practices

### 1. Organization
- Group related tests using `test.describe()`
- Use descriptive test names that explain what is being tested
- Keep tests independent of each other

### 2. Assertions
- Always verify response status codes
- Validate response structure and data types
- Use specific assertions rather than generic ones

### 3. Data Management
- Use test data helpers for creating consistent test data
- Avoid hardcoding test data in tests
- Clean up test data when necessary

### 4. Error Handling
- Test both success and failure scenarios
- Verify appropriate error responses
- Test edge cases and boundary conditions

### 5. Configuration
- Use environment variables for different environments
- Keep sensitive data out of test files
- Use baseURL for consistent endpoint management

## Troubleshooting

### Common Issues:

1. **Tests failing with network errors**
   - Check your internet connection
   - Verify the API endpoint is accessible
   - Check if the API has rate limiting

2. **TypeScript compilation errors**
   - Ensure all required packages are installed
   - Check your `tsconfig.json` configuration
   - Make sure file paths are correct

3. **Assertion failures**
   - Verify the API response format matches your expectations
   - Check if the API behavior has changed
   - Use `console.log()` to debug response data

4. **Tests timing out**
   - Increase timeout in playwright config if needed
   - Check if the API is responding slowly
   - Add retry logic for flaky endpoints

## Exercises

### Exercise 1: Test the Users Endpoint
Extend your test suite to test the `/users` endpoint:
- GET all users
- GET user by ID
- POST to create a user
- PUT to update a user
- DELETE a user

### Exercise 2: Add Validation Tests
Create tests that validate:
- Required fields in requests
- Data type validation
- Field length limits
- Invalid data handling

### Exercise 3: Performance Testing
Add tests that verify:
- Response time limits
- Concurrent request handling
- Large payload handling

## Conclusion

Congratulations! You've successfully created a comprehensive Playwright test suite for REST API testing. You've learned how to:

- Set up a Playwright project from scratch
- Configure TypeScript and Playwright for API testing
- Write tests for all major HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Handle different response types and status codes
- Use assertions to verify API behavior
- Implement best practices for API testing

Continue practicing by testing different APIs and exploring more advanced Playwright features like fixtures, page object models, and custom reporters.

## Additional Resources

- [Playwright API Testing Documentation](https://playwright.dev/docs/test-api-testing)
- [JSONPlaceholder API Documentation](https://jsonplaceholder.typicode.com/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
