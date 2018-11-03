import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/billing/new/list?${stringify(params)}`);
}

export async function queryTask(params) {
  return request(`/api/billing/task/list?${stringify(params)}`);
}

export async function queryGroupNames() {
  return request('/api/task/queryAllGroupNames');
}

export async function queryTypes() {
  return request(`/api/billing/new/types`);
}

export async function queryChannel() {
  return request(`/api/billing/new/channel`);
}

export async function saveBilling(params) {
  return request('/api/billing/new/save', {
    method: 'POST',
    body: params,
  });
}
