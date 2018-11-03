import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryDetail(params) {
  return request(`/api/billing/list?${stringify(params)}`);
}

export async function disposeRecord(params) {
  return request(`/api/billing/disposeRecord`, {
    method: 'POST',
    body: params,
  });
}

export async function auditRecord(params) {
  return request(`/api/billing/auditRecord`, {
    method: 'POST',
    body: params,
  });
}

export async function updateRecord(params) {
  return request(`/api/billing/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteRecord(params) {
  return request('/api/billing/delete', {
    method: 'POST',
    body: params,
  });
}

export async function queryAuditStatus() {
  return request(`/api/common/auditStatus`);
}

export async function queryDisposeStatus() {
  return request(`/api/common/disposeStatus`);
}
