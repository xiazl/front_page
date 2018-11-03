import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, logout } from '@/services/login';
import { setAuthority, clearAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { authority } from '@/constant';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.success,
          message: response.message,
          currentAuthority: (response.data && response.data.roleCode) || '',
        },
      });
      // Login successfully
      if (response.success) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        } else {
          const {
            data: { roleCode },
          } = response;
          switch (roleCode) {
            case authority.cardmanager:
              redirect = '/task/create';
              break;
            case authority.teamleader:
              redirect = '/task/registration';
              break;
            case authority.operator:
              redirect = '/task/registration';
              break;
            case authority.auditor:
              redirect = '/task/create';
              break;
            case authority.admin:
              redirect = '/statistic/card';
              break;
            case authority.superadmin:
              redirect = '/statistic/card';
              break;
            case authority.billingmanager:
              redirect = '/statistic/balance';
              break;

            // TO-DO other authority index
            default:
              redirect = '/';
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call, put }) {
      const { userName, resolve } = payload;
      const response = yield call(getFakeCaptcha, userName);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.success,
          message: response.message,
          currentAuthority: '',
        },
      });
      if (response.success) {
        resolve();
      }
    },

    *logout({ payload }, { call, put }) {
      let response = null;
      if (payload) {
        // 主动登出，要发送请求到后端
        response = yield call(logout);
      } else {
        // session失效，被系统踢出
        response = { success: true };
      }

      if (response.success) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority: '',
          },
        });
        clearAuthority();
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        message: payload.message,
      };
    },
  },
};
