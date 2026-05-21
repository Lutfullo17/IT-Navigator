import client from './client';

export async function sendContactFeedback({ name, telegram, message }) {
  const response = await client.post('/feedback/contact/', {
    name,
    telegram,
    message,
  });
  return response.data;
}
