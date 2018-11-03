import { querySetting, saveSetting } from '../services/api';

export default {
  namespace: 'settings',

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
      const response = yield call(querySetting, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 新增保存
    *update({ payload, callback }, { call }) {
      const response = yield call(saveSetting, payload);
      if (callback) callback(response);
    },
  },
};
