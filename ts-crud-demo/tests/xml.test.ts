import { parseStringPromise } from 'xml2js'; // npm install xml2js
import { test, expect } from '@playwright/test';

test('Handle XML response', async ({ request }) => {
  const response = await request.get('https://api.example.com/programmes.xml');

  expect(response.status()).toBe(200);  
  const xmlBody = await response.text();
  const parsedXml = await parseStringPromise(xmlBody);
  console.log(parsedXml);
  expect(parsedXml.programmes).toBeDefined();
});