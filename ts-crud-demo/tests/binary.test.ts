import fs from 'fs';
import { test, expect } from '@playwright/test';

test('Handle binary file download', async ({ request }) => {
  const response = await request.get('https://watchelm.com/static/media/watchelmlogo-with-strap.9c4897a8458b9da0d4b004a9e7246525.svglogo.png');
  
  expect(response.status()).toBe(200);
  
  const buffer = await response.body();
  fs.writeFileSync('logo.png', buffer);
  
  expect(buffer.length).toBeGreaterThan(0);
});