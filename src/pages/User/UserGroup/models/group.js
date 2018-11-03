import { queryGroup, addGroup, updateGroup, deleteGroup } from '../services/api';

export default {
  namespace: 'group',

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
      const response = yield call(queryGroup, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },

    // 新增小组
    *add({ payload, callback }, { call }) {
      const response = yield call(addGroup, payload);
      if (callback) callback(response);
    },
    // 编辑小组
    *update({ payload, callback }, { call }) {
      const response = yield call(updateGroup, payload);
      if (callback) callback(response);
    },
    // 删除小组
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteGroup, payload);
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
