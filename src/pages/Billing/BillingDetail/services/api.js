import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/billing/detail/list?${stringify(params)}`);
}

export async function queryTask(params) {
  return request(`/api/billing/task/list?${stringify(params)}`);
}

export async function queryStatus() {
  return request(`/api/billing/detail/status`);
}

export async function queryTypes() {
  return request(`/api/billing/detail/failedType`);
}

export async function tagTask(params) {
  return request('/api/billing/detail/tag', {
    method: 'POST',
    body: params,
  });
}

export async function finishTask(params) {
  return request('/api/billing/detail/finish', {
    method: 'POST',
    body: params,
  });
}
