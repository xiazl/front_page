import {
  getCurDay,
  getCurTime,
  queryNoticeCount,
  queryNotices,
  markNoticeRead,
  markAllNoticesRead,
  getWebSocketServerInfo,
} from '@/services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    curDay: null,
    unreadNoticeCount: 0,
    unreadNotices: [],
    readNotices: [],
    webSocketServerInfo: null,
  },

  effects: {
    // 从后台获取当前时间属于的业务日期
    *fetchCurDay({ callback }, { call, put }) {
      const response = yield call(getCurDay);
      if (response.success) {
        yield put({
          type: 'saveCurDay',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },

    // 从后台获取当前时间属于的业务日期
    *fetchCurTime({ callback }, { call, put }) {
      const response = yield call(getCurTime);
      if (response.success) {
        yield put({
          type: 'saveCurTime',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    /** 获取未读消息个数 */
    *fetchUnreadNoticeCount({ callback }, { call, put }) {
      const response = yield call(queryNoticeCount, { status: 0 });
      if (response.success) {
        yield put({
          type: 'saveUnreadNoticeCount',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    /** 获取消息列表 */
    *fetchNotices({ payload, callback }, { call, put }) {
      const response = yield call(queryNotices, payload);
      if (response.success) {
        yield put({
          type: 'saveNotices',
          payload: response.data,
          meta: payload,
        });
      }
      if (callback) callback(response);
    },
    /** 标记消息为已读 */
    *markNoticeRead({ payload, callback }, { call, put }) {
      const response = yield call(markNoticeRead, payload);
      if (response.success) {
        yield put({
          type: 'updateNoticeStatus',
          payload,
        });
      }
      if (callback) callback(response);
    },
    /** 标记全部消息为已读 */
    *markAllNoticesRead({ payload, callback }, { call, put }) {
      const response = yield call(markAllNoticesRead, payload);
      if (response.success) {
        yield put({
          type: 'updateNoticeStatus',
        });
      }
      if (callback) callback(response);
    },
    /** 获取服务器信息 */
    *getWebSocketServerInfo({ callback }, { call, put }) {
      const response = yield call(getWebSocketServerInfo);
      if (response.success) {
        yield put({
          type: 'saveWebSocketServerInfo',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveCurDay(state, { payload }) {
      return {
        ...state,
        curDay: payload,
      };
    },
    saveUnreadNoticeCount(state, { payload }) {
      return {
        ...state,
        unreadNoticeCount: payload,
      };
    },
    saveNotices(state, { payload, meta }) {
      if (meta.status === 0) {
        return {
          ...state,
          unreadNotices: payload,
        };
      }

      return {
        ...state,
        readNotices: payload,
      };
    },
    updateNoticeStatus(state, { payload }) {
      let { unreadNoticeCount, readNotices } = state;
      const { unreadNotices } = state;
      const newUnreadNotices = [];
      if (payload) {
        unreadNoticeCount--;
        unreadNotices.forEach(notice => {
          if (notice.id === payload.id) {
            readNotices.push({ ...notice, status: 1 });
          } else {
            newUnreadNotices.push(notice);
          }
        });
      } else {
        readNotices = readNotices.concat(unreadNotices.map(notice => ({ ...notice, status: 1 })));
        unreadNoticeCount = 0;
      }

      return {
        ...state,
        unreadNoticeCount,
        unreadNotices: newUnreadNotices,
        readNotices,
      };
    },
    saveWebSocketServerInfo(state, { payload }) {
      return {
        ...state,
        webSocketServerInfo: payload,
      };
    },
    addUnreadNoticeCount(state, { payload }) {
      return {
        ...state,
        unreadNoticeCount: state.unreadNoticeCount + payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
