import client from './client';
import { localizeResults } from '../utils/directions';

export async function getDashboard() {
  const response = await client.get('/progress/dashboard/');
  const data = response.data;
  if (data?.tests?.latest_results) {
    data.tests.latest_results = localizeResults(data.tests.latest_results);
  }
  return data;
}