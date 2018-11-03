import fetchDailyData from '../services/api';

export default {
  namespace: 'dailyData',

  state: {
    auditWithdrawAmount: 0,
    auditWithdrawDhAmount: 0,
    auditWithdrawDjAmount: 0,
    auditWithdrawKzAmount: 0,
    auditWithdrawZfbAmount: 0,
    cardTimeCount: 0,
    extraAmount: 0,
    pCount: 0,
    planAmount: 0,
    ptCount: 0,
    realAmount: 0,
    shouldAmount: 0,
    unbindAmount: 0,
    withdrawAmount: 0,
    withdrawDhAmount: 0,
    withdrawDjAmount: 0,
    withdrawKzAmount: 0,
    withdrawZfbAmount: 0,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(fetchDailyData, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
