import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCard(params) {
  return request(`/api/card/list?${stringify(params)}`);
}

export async function addCard(params) {
  return request('/api/card/create', {
    method: 'POST',
    body: params,
  });
}

export async function updateCard(params) {
  return request('/api/card/modify', {
    method: 'POST',
    body: params,
  });
}

export async function disableCard(params) {
  return request('/api/card/disable', {
    method: 'POST',
    body: params,
  });
}

export async function getCleartips() {
  return request('/api/card/cleartips');
}

export async function clearAmount() {
  return request('/api/card/clearamount');
}

export async function getProjectList() {
  return request('/api/card/project/list');
}

export async function addProject(params) {
  return request('/api/card/project/insert', {
    method: 'POST',
    body: params,
  });
}

export async function deleteProject(params) {
  return request('/api/card/project/delete', {
    method: 'POST',
    body: params,
  });
}

export async function queryDisableCard(params) {
  return request(`/api/card/disable_list_json?${stringify(params)}`);
}

export async function enableCard(params) {
  return request('/api/card/enable', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCard(params) {
  return request('/api/card/delete', {
    method: 'POST',
    body: params,
  });
}

export async function updateReason(params) {
  return request('/api/card/updateReason', {
    method: 'POST',
    body: params,
  });
}
