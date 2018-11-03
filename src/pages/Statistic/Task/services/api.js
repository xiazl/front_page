import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTaskStatistic(params) {
  return request(`/api/statistical/taskHistoryData?${stringify(params)}`);
}

export async function updateExamine(params) {
  return request('/api/task/examineTask', {
    method: 'POST',
    body: params,
  });
}
