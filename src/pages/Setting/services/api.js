import request from '@/utils/request';

export async function querySetting() {
  return request(`/api/setting/list`);
}

export async function saveSetting(params) {
  return request('/api/setting/save', {
    method: 'POST',
    body: params,
  });
}
