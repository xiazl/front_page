import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRecord(params) {
  return request(`/api/balance/list?${stringify(params)}`);
}

export async function updateBalance(params) {
  return request('/api/balance/save', {
    method: 'POST',
    body: params,
  });
}
