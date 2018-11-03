import { queryRecord, updateBalance } from '../services/api';

export default {
  namespace: 'cardBalance',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    listRole: [],
  },

  effects: {
    // 查询
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRecord, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 修改余额
    *update({ payload, callback }, { call }) {
      const response = yield call(updateBalance, payload);
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
