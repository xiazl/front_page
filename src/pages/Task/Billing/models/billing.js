import {
  queryDetail,
  queryAuditStatus,
  queryDisposeStatus,
  auditRecord,
  disposeRecord,
  updateRecord,
  deleteRecord,
} from '../services/api';

export default {
  namespace: 'billing',

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
    // 审计状态
    *listAuditStatus({ payload, callback }, { call, put }) {
      const response = yield call(queryAuditStatus, payload);
      if (response.success) {
        yield put({
          type: 'saveAuditStatus',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },

    // 处理状态
    *listDisposeStatus({ payload, callback }, { call, put }) {
      const response = yield call(queryDisposeStatus, payload);
      if (response.success) {
        yield put({
          type: 'saveDisposeStatus',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    // 审计
    *audit({ payload, callback }, { call }) {
      const response = yield call(auditRecord, payload);
      if (callback) callback(response);
    },
    // 处理
    *dispose({ payload, callback }, { call }) {
      const response = yield call(disposeRecord, payload);
      if (callback) callback(response);
    },

    // 修改
    *update({ payload, callback }, { call }) {
      const response = yield call(updateRecord, payload);
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
