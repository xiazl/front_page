import request from '@/utils/request';

export async function queryTeamBalance() {
  return request('/api/statistical/queryTeamBalance');
}

export async function queryCardBalance() {
  return request('/api/statistical/queryCardBalance');
}

export async function queryTeamStatistics() {
  return request('/api/statistical/queryTeamStatistics');
}
