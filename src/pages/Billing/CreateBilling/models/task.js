import {
  queryTask,
  queryTypes,
  queryChannel,
  queryGroupNames,
  saveBilling,
  deleteTasks,
  queryMainTypes,
  getPrivateGroup,
  savePrivateGroup,
  deletePrivateGroup,
  updatePriority,
} from '../services/api';

export default {
  namespace: 'createBilling',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    types: [],
    channels: [],
    groupNames: [],
    mainTypes: [],
  },

  effects: {
    // 任务查询
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

    *listMainTypes({ callback }, { call, put }) {
      const response = yield call(queryMainTypes);
      if (response.success) {
        yield put({
          type: 'saveMainTypes',
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

    // 删除任务
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteTasks, payload);
      if (callback) callback(response);
    },

    // 专用组查询
    *getPrivateGroup({ callback }, { call, put }) {
      const response = yield call(getPrivateGroup);
      if (response.success) {
        yield put({
          type: 'savePrivateGroup',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 增加专用组
    *addPrivateGroup({ payload, callback }, { call }) {
      const response = yield call(savePrivateGroup, payload);
      if (callback) callback(response);
    },

    // 删除专用组
    *deletePrivateGroup({ payload, callback }, { call }) {
      const response = yield call(deletePrivateGroup, payload);
      if (callback) callback(response);
    },

    /** 变更优先级 */
    *updatePriority({ payload, callback }, { call }) {
      const response = yield call(updatePriority, payload);
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

    saveMainTypes(state, action) {
      return {
        ...state,
        mainTypes: action.payload.data,
      };
    },
    savePrivateGroup(state, action) {
      return {
        ...state,
        privateGroup: action.payload.data,
      };
    },
  },
};
