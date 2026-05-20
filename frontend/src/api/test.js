import client from './client';
import { localizeResults } from '../utils/directions';

export async function startTest(language = 'uz', count = 15) {
  const response = await client.post('/test/start/', { language, count });
  return response.data;
}

export async function submitAnswers(sessionId, answers, language = 'uz') {
  const response = await client.post(`/test/${sessionId}/submit/`, {
    answers,
    language,
  });
  return {
    ...response.data,
    results: localizeResults(response.data.results),
  };
}

export async function getTest(sessionId) {
  const response = await client.get(`/test/${sessionId}/`);
  return response.data;
}

export async function getMyTests() {
  const response = await client.get('/test/my/');
  return response.data;
}
