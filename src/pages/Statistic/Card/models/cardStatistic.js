import { queryCardHistory, queryCardHistoryTotal } from '../services/api';

export default {
  namespace: 'cardStatistic',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    total: {},
  },

  effects: {
    // 查询卡片统计数据明细
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCardHistory, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 查询卡片统计数据合计
    *fetchTotal({ payload, callback }, { call, put }) {
      const response = yield call(queryCardHistoryTotal, payload);
      if (response.success) {
        yield put({
          type: 'saveTotal',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
    saveTotal(state, action) {
      return {
        ...state,
        total: action.payload.data,
      };
    },
  },
};
