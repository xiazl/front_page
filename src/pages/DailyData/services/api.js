import request from '@/utils/request';

export default async function fetchDailyData(params) {
  return request('/api/statistical/initdata', {
    method: 'POST',
    body: params,
  });
}
