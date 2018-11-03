import { stringify } from 'qs';
import request from '@/utils/request';

// 从服务器获取当前日期 - 全局使用
export async function getCurDay() {
  return request(`/api/common/getCurDay`);
}

// 从服务器获取当前时间 - 全局使用
export async function getCurTime() {
  return request(`/api/common/getCurTime`);
}

/** 获取消息个数 */
export async function queryNoticeCount(params) {
  return request(`/api/notice/queryCount?${stringify(params)}`);
}

/** 获取消息列表 */
export async function queryNotices(params) {
  return request(`/api/notice/query?${stringify(params)}`);
}

/** 将消息标记已读 */
export async function markNoticeRead(params) {
  return request(`/api/notice/markRead?${stringify(params)}`);
}

/** 将全部消息标记已读 */
export async function markAllNoticesRead(params) {
  return request('/api/notice/markAllRead', {
    method: 'POST',
    body: params,
  });
}

/** 获取服务器信息 */
export async function getWebSocketServerInfo() {
  return request('/api/common/getWebSocketServerInfo');
}
