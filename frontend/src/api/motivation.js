import client from './client';

export async function getRandomMessage(category = null) {
  const params = category ? { category } : {};
  const response = await client.get('/motivation/random/', { params });
  return response.data;
}

export async function getMessages(category = null) {
  const params = category ? { category } : {};
  const response = await client.get('/motivation/', { params });
  return response.data;
}
