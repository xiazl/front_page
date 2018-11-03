import { queryList, queryTypes, queryChannel, queryGroupNames, saveBilling } from '../services/api';

export default {
  namespace: 'billingList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    types: [],
    channels: [],
    groupNames: [],
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

    // 出账类型选择
    *listTypes({ payload, callback }, { call, put }) {
      const response = yield call(queryTypes, payload);
      if (response.success) {
        yield put({
          type: 'saveTypes',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 出账渠道
    *listChannels({ payload, callback }, { call, put }) {
      const response = yield call(queryChannel, payload);
      if (response.success) {
        yield put({
          type: 'saveChannels',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    *listGroupNames({ callback }, { call, put }) {
      const response = yield call(queryGroupNames);
      if (response.success) {
        yield put({
          type: 'saveGroupNames',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 新增
    *add({ payload, callback }, { call }) {
      const response = yield call(saveBilling, payload);
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
    saveTypes(state, action) {
      return {
        ...state,
        types: action.payload.data,
      };
    },
    saveChannels(state, action) {
      return {
        ...state,
        channels: action.payload.data,
      };
    },
    saveGroupNames(state, action) {
      return {
        ...state,
        groupNames: action.payload.data,
      };
    },
  },
};
