import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRecord(params) {
  return request(`/api/cardChange/list?${stringify(params)}`);
}

export async function unUsed() {
  return request('/api/cardChange/unUsed');
}
