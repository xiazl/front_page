import {
  queryUser,
  queryRoles,
  addUser,
  updateUser,
  disableUsers,
  enableUsers,
  deleteUsers,
  updatePassword,
  resetPassword,
  listInfo,
  updateInfo,
  queryGroups,
} from '../services/api';

export default {
  namespace: 'users',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    roles: [],
    groups: [],
  },

  effects: {
    // 查询
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 用户角色选择
    *listRole({ payload, callback }, { call, put }) {
      const response = yield call(queryRoles, payload);
      if (response.success) {
        yield put({
          type: 'saveRoles',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },

    // 小组
    *listGroup({ payload, callback }, { call, put }) {
      const response = yield call(queryGroups, payload);
      if (response.success) {
        yield put({
          type: 'saveGroups',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    // 新增用户
    *add({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    // 编辑用户
    *update({ payload, callback }, { call }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
    // 停用用户
    *disable({ payload, callback }, { call }) {
      const response = yield call(disableUsers, payload);
      if (callback) callback(response);
    },
    // 启用用户
    *enable({ payload, callback }, { call }) {
      const response = yield call(enableUsers, payload);
      if (callback) callback(response);
    },
    // 删除用户
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteUsers, payload);
      if (callback) callback(response);
    },
    // 修改密码
    *password({ payload, callback }, { call }) {
      const response = yield call(updatePassword, payload);
      if (callback) callback(response);
    },
    // 重置密码
    *resetPassword({ payload, callback }, { call }) {
      const response = yield call(resetPassword, payload);
      if (callback) callback(response);
    },
    // 获取基本信息
    *listInfo({ payload, callback }, { call }) {
      const response = yield call(listInfo, payload);
      if (callback) callback(response);
    },
    // 修改基本信息
    *updateInfo({ payload, callback }, { call }) {
      const response = yield call(updateInfo, payload);
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
    saveRoles(state, action) {
      return {
        ...state,
        roles: action.payload,
      };
    },
    saveGroups(state, action) {
      return {
        ...state,
        groups: action.payload,
      };
    },
  },
};
