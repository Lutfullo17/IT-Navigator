import client from './client';

export async function getRoadmapPlan(direction) {
  const response = await client.get('/roadmap/plan/', {
    params: { direction },
  });
  return response.data;
}
