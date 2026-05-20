import client from './client';

export async function getTasks(direction = null) {
  const params = direction ? { direction } : {};
  const response = await client.get('/tasks/', { params });
  return response.data;
}

export async function getTask(taskId) {
  const response = await client.get(`/tasks/${taskId}/`);
  return response.data;
}

export async function completeTask(taskId, liked) {
  const response = await client.post(`/tasks/${taskId}/complete/`, { liked });
  return response.data;
}

export async function getMyCompletions() {
  const response = await client.get('/tasks/my/');
  return response.data;
}
