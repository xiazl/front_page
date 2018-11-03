import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryTaskList(params) {
  return request(`/api/task/showTask_json?${stringify(params)}`);
}

export async function changeCard(params) {
  return request('/api/task/changeCard', {
    method: 'POST',
    body: params,
  });
}

export async function removeCard(params) {
  return request('/api/task/removeCard', {
    method: 'POST',
    body: params,
  });
}

export async function editAmountShould(params) {
  return request('/api/dealDeposit/editAmountShould', {
    method: 'POST',
    body: params,
  });
}

export async function queryMatchedRecord(params) {
  return request(`/api/registration/queryMatchedRecord?${stringify(params)}`);
}

export async function queryNotMatchedRecord(params) {
  return request(`/api/registration/queryNotMatchedRecord?${stringify(params)}`);
}

export async function bundling(params) {
  return request('/api/registration/bundling', {
    method: 'POST',
    body: params,
  });
}

export async function removeBundling(params) {
  return request('/api/registration/removeBundling', {
    method: 'POST',
    body: params,
  });
}

export async function setExtraDeposit(params) {
  return request('/api/deposit/extraRecord', {
    method: 'POST',
    body: params,
  });
}

export async function getWebSocketServerInfo() {
  return request('/api/common/getWebSocketServerInfo');
}

export async function openOrClosedAutoMatch(params) {
  return request('/api/setting/openOrClosedAutoMatch', {
    method: 'POST',
    body: params,
  });
}
