import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTaskList(params) {
  return request(`/api/task/list?${stringify(params)}`);
}

export async function queryAllGroupNames() {
  return request('/api/task/queryAllGroupNames');
}

export async function queryAllProjectNames() {
  return request('/api/task/queryAllProjectNames');
}

export async function queryAllBankNames() {
  return request('/api/task/queryAllBankNames');
}

export async function saveTask(params) {
  return request('/api/task/taskSave', {
    method: 'POST',
    body: params,
  });
}

export async function updateBatchName(params) {
  return request('/api/task/updateBatchName', {
    method: 'POST',
    body: params,
  });
}

export async function deleteProjectTask(params) {
  return request('/api/task/deleteProjectTask', {
    method: 'POST',
    body: params,
  });
}

export async function addNewCard(params) {
  return request('/api/task/addNewCard', {
    method: 'POST',
    body: params,
  });
}

export async function checkBatchDetails(params) {
  return request('/api/statistical/exportMultiBatchDetailTxtByIds2', {
    method: 'POST',
    body: params,
  });
}
