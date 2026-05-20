import client from './client';

export async function startChat() {
  const response = await client.post('/mentor/start/');
  return response.data;
}

export async function sendMessage(sessionId, message, language = 'uz') {
  const response = await client.post(`/mentor/${sessionId}/send/`, {
    message,
    language,
  });
  return response.data;
}

export async function getChat(sessionId) {
  const response = await client.get(`/mentor/${sessionId}/`);
  return response.data;
}

export async function getMyChats() {
  const response = await client.get('/mentor/my/');
  return response.data;
}
