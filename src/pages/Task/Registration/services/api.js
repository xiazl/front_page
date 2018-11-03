import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRegistrationList(params) {
  return request(`/api/registration/list_data?${stringify(params)}`);
}

export async function queryRegistrationListTotal(params) {
  return request(`/api/registration/list_data_total?${stringify(params)}`);
}

export async function addDepositByTxt(params) {
  return request('/api/registration/addDepositRecord4Txt', {
    method: 'POST',
    body: params,
  });
}

export async function addBillingByTxt(params) {
  return request('/api/registration/addBatchWithdrawRecord4Txt', {
    method: 'POST',
    body: params,
  });
}

export async function addDeposit(params) {
  return request('/api/registration/addDepositRecord', {
    method: 'POST',
    body: params,
  });
}

export async function addBilling(params) {
  return request('/api/registration/addWithdrawRecord4Txt', {
    method: 'POST',
    body: params,
  });
}

export async function queryDepositDetails(params) {
  return request('/api/registration/queryDepositDetails', {
    method: 'POST',
    body: params,
  });
}

export async function queryBillingDetails(params) {
  return request('/api/registration/queryWithdrawqDetails', {
    method: 'POST',
    body: params,
  });
}
