import { test, expect } from '@playwright/test';

const BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

test.describe('API - FakeRestApi Books', () => {
  test('CT001 - Realizar GET', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/Books`);
    expect(response.ok()).toBeTruthy();
  });

  test('CT002 - Criar uma chamada POST e validar o retorno', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/Books`, {
      headers: { 'content-type': 'application/json' },
      data: { id: 201, title: 'Paulo' },
    });
    expect(response.status()).toBe(200);
  });

  test('CT003 - Criar uma chamada GET, que consulte o que foi criado no POST e validar o retorno', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/Books/200`);
    expect(response.status()).toBe(200);
  });

  test('CT004 - Criar uma chamada UPDATE, que delete o que foi criado no POST e validar o retorno', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/Books/201`, {
      headers: { 'content-type': 'application/json' },
      data: {
        id: 201,
        title: 'Paulo',
        dueDate: '2022-10-21T03:56:48.6Z',
        completed: true,
      },
    });
    expect(response.status()).toBe(200);
  });

  test('CT005 - Criar uma chamada DELETE, que delete o que foi criado no POST e validar o retorno', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/Books/201`);
    expect(response.status()).toBe(200);
  });
});
