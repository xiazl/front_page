import {
  queryList,
  queryTask,
  queryStatus,
  queryTypes,
  tagTask,
  finishTask,
} from '../services/api';

export default {
  namespace: 'billingDetail',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    listStatus: [],
    failedTypes: [],
  },

  effects: {
    // 查询
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 任务详情
    *fetchTask({ payload, callback }, { call, put }) {
      const response = yield call(queryTask, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 状态
    *listStatus({ callback }, { call, put }) {
      const response = yield call(queryStatus);
      if (response.success) {
        yield put({
          type: 'saveStatus',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 状态
    *failedTypes({ callback }, { call, put }) {
      const response = yield call(queryTypes);
      if (response.success) {
        yield put({
          type: 'saveTypes',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 标记开始
    *tag({ payload, callback }, { call }) {
      const response = yield call(tagTask, payload);
      if (callback) callback(response);
    },

    // 标记完成
    *finish({ payload, callback }, { call }) {
      const response = yield call(finishTask, payload);
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
    saveStatus(state, action) {
      return {
        ...state,
        listStatus: action.payload.data,
      };
    },

    saveTypes(state, action) {
      return {
        ...state,
        failedTypes: action.payload.data,
      };
    },
  },
};
