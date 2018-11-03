import queryProjectStatistic from '../services/api';

export default {
  namespace: 'projectStatistic',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 查询项目统计数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryProjectStatistic, payload);
      if (response.success) {
        yield put({
          type: 'save',
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
  },
};
