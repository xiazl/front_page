import { queryDetail, updateRecord, deleteRecord, extraRecord } from '../services/api';

export default {
  namespace: 'deposit',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 查询
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDetail, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 修改
    *update({ payload, callback }, { call }) {
      const response = yield call(updateRecord, payload);
      if (callback) callback(response);
    },

    // 转额外收入
    *extra({ payload, callback }, { call }) {
      const response = yield call(extraRecord, payload);
      if (callback) callback(response);
    },

    // 删除
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteRecord, payload);
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
    saveAuditStatus(state, action) {
      return {
        ...state,
        auditStatus: action.payload,
      };
    },
    saveDisposeStatus(state, action) {
      return {
        ...state,
        disposeStatus: action.payload,
      };
    },
  },
};
