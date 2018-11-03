import request from '@/utils/request';

// 登录
export async function fakeAccountLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params,
  });
}

// 获取验证码
export async function getFakeCaptcha(userName) {
  return request('/api/common/getTelegramCode', {
    method: 'POST',
    body: { userName },
  });
}

// 登出
export async function logout() {
  return request('/api/user/logout');
}
