import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryGroup(params) {
  return request(`/api/group/list?${stringify(params)}`);
}

export async function addGroup(params) {
  return request('/api/group/save', {
    method: 'POST',
    body: params,
  });
}

export async function updateGroup(params) {
  return request('/api/group/update', {
    method: 'POST',
    body: params,
  });
}

export async function deleteGroup(params) {
  return request('/api/group/delete', {
    method: 'POST',
    body: params,
  });
}
