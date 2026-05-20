import client from './client';
import { localizeDirection, localizeDirections } from '../utils/directions';

export async function getDirections() {
  const response = await client.get('/directions/');
  return localizeDirections(response.data);
}

export async function getDirection(slug) {
  const response = await client.get(`/directions/${slug}/`);
  return localizeDirection(response.data);
}
