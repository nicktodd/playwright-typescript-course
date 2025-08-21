import { test, expect } from '@playwright/test';

test('GET / returns TV Schedule', async ({ request }) => {

  // this will use the baseURL value in playwright.config.ts
  const response = await request.get("");
  expect(response.status()).toBe(200);

  const jsonBody = await response.json();
  expect(jsonBody).toEqual(
    expect.any(Array),
  );

});


test('GET request with query params', async ({ request }) => {
  const response = await request.get('', {
    params: { channel: 'BBC1' }
  });
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.length).toBeGreaterThan(0);
});

test('POST request to create a schedule entry', async ({ request }) => {
  const newEntry = {
    title: 'Evening News',
    time: '18:00',
    channel: 'BBC1'
  };
  const response = await request.post('https://api.example.com/schedule', {
    data: newEntry
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.title).toBe('Evening News');
});

test('PUT request to update programme metadata', async ({ request }) => {
  const updatedMetadata = {
    title: 'Evening News - Extended Edition',
    duration: 45
  };
  const response = await request.put('https://api.example.com/programmes/123', {
    data: updatedMetadata
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.duration).toBe(45);
});

test('DELETE request to remove a programme', async ({ request }) => {
  const response = await request.delete('https://api.example.com/programmes/123');
  expect(response.status()).toBe(204);
});

test('GET request with custom headers', async ({ request }) => {
  const response = await request.get('https://api.example.com/secure-data', {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Accept-Language': 'en-GB'
    }
  });
  expect(response.status()).toBe(200);
});

test('Handle plain text response', async ({ request }) => {
  const response = await request.get('https://api.example.com/version');
  
  expect(response.status()).toBe(200);
  
  const textBody = await response.text();
  console.log('API Version:', textBody);
  expect(textBody).toMatch(/^v\d+\.\d+/); // e.g., v1.2
});






