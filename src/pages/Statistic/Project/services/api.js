import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryProjectStatistic(params) {
  return request(`/api/statistical/projectHistoryData?${stringify(params)}`);
}
