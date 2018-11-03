import { isJsonString } from '@/utils/utils';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString = sessionStorage.getItem(AUTHORITY_KEY);
  let authority;
  if (isJsonString(authorityString)) {
    authority = JSON.parse(authorityString);
  } else {
    authority = [authorityString];
  }
  return authority || [];
}

// 设置权限
export function setAuthority(authority) {
  let authorityString;
  if (isJsonString(authority)) {
    authorityString = JSON.stringify(authority);
  } else {
    authorityString = [authority];
  }
  return sessionStorage.setItem(AUTHORITY_KEY, authorityString);
}

// 清除权限
export function clearAuthority() {
  return sessionStorage.removeItem(AUTHORITY_KEY);
}

// 检查权限
export function checkAuthority(authority) {
  const currentAuthority = getAuthority();
  // 没有判定权限.默认查看所有
  // Retirement authority, return true;
  if (!authority) {
    return true;
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return true;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return true;
        }
      }
    }
    return false;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority === currentAuthority) {
      return true;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return true;
        }
      }
    }
    return false;
  }

  return false;
}
