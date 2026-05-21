import client from './client';

export async function getDashboard() {
  const response = await client.get('/progress/dashboard/');
  return response.data;
}