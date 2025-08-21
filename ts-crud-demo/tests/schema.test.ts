import Ajv from 'ajv';
import { test, expect } from '@playwright/test';

const ajv = new Ajv();

// Define a simple JSON schema
const programmeArraySchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'title', 'time', 'channel'],
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      time: { type: 'string', pattern: '^\\d{2}:\\d{2}$' },
      channel: { type: 'string' }
    }
  }
};

test('Validate programme API response schema', async ({ request }) => {
  // uses the base url in the playwright.config.ts
  const response = await request.get('');
  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log('Response data:', data);
  const validate = ajv.compile(programmeArraySchema);

  const valid = validate(data);
  expect(valid).toBeTruthy();

  if (!valid) {
    console.error(validate.errors);
  }
});