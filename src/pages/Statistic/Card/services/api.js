import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCardHistory(params) {
  return request(`/api/card/queryCardHistory?${stringify(params)}`);
}

export async function queryCardHistoryTotal(params) {
  return request(`/api/card/queryCardHistoryTotal?${stringify(params)}`);
}
