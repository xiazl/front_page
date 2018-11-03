import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryUser(params) {
  return request(`/api/user/list?${stringify(params)}`);
}

export async function addUser(params) {
  return request('/api/user/save', {
    method: 'POST',
    body: params,
  });
}

export async function updateUser(params) {
  return request('/api/user/update', {
    method: 'POST',
    body: params,
  });
}

export async function queryRoles() {
  return request(`/api/user/listRole`);
}

export async function queryGroups() {
  return request(`/api/group/listGroups`);
}

export async function disableUsers(params) {
  return request('/api/user/disable', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUsers(params) {
  return request('/api/user/delete', {
    method: 'POST',
    body: params,
  });
}

export async function enableUsers(params) {
  return request('/api/user/enable', {
    method: 'POST',
    body: params,
  });
}

export async function listInfo() {
  return request(`/api/user/profile`);
}

export async function updateInfo(params) {
  return request('/api/user/profile_save', {
    method: 'POST',
    body: params,
  });
}

export async function updatePassword(params) {
  return request('/api/user/editPassword', {
    method: 'POST',
    body: params,
  });
}

export async function resetPassword(params) {
  return request('/api/user/resetPassword', {
    method: 'POST',
    body: params,
  });
}
