import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryDetail(params) {
  return request(`/api/deposit/list?${stringify(params)}`);
}

export async function updateRecord(params) {
  return request(`/api/deposit/update`, {
    method: 'POST',
    body: params,
  });
}

export async function extraRecord(params) {
  return request('/api/deposit/extraRecord', {
    method: 'POST',
    body: params,
  });
}

export async function deleteRecord(params) {
  return request('/api/deposit/delete', {
    method: 'POST',
    body: params,
  });
}
