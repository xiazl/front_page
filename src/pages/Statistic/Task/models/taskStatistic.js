import { queryTaskStatistic, updateExamine } from '../services/api';

export default {
  namespace: 'taskStatistic',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 查询任务统计数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTaskStatistic, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    *examine({ payload, callback }, { call }) {
      const response = yield call(updateExamine, payload);
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
  },
};
