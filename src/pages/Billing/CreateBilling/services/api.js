import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTask(params) {
  return request(`/api/billing/task/list?${stringify(params)}`);
}

export async function queryGroupNames() {
  return request('/api/group/listGroups');
}

export async function queryTypes() {
  return request(`/api/billing/task/types`);
}

export async function queryChannel() {
  return request(`/api/billing/task/channel`);
}

export async function queryMainTypes() {
  return request(`/api/billing/task/mainType`);
}

export async function saveBilling(params) {
  return request('/api/billing/task/save', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTasks(params) {
  return request('/api/billing/task/delete', {
    method: 'POST',
    body: params,
  });
}

export async function getPrivateGroup() {
  return request(`/api/billing/group/list`);
}

export async function savePrivateGroup(params) {
  return request('/api/billing/group/add', {
    method: 'POST',
    body: params,
  });
}

export async function deletePrivateGroup(params) {
  return request('/api/billing/group/delete', {
    method: 'POST',
    body: params,
  });
}

export async function updatePriority(params) {
  return request(`/api/billing/task/updatePriority?${stringify(params)}`, {
    method: 'POST',
  });
}
