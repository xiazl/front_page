import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryBatchStatistic(params) {
  return request(`/api/statistical/batchHistoryData?${stringify(params)}`);
}
