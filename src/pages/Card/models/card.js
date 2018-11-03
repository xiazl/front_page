import {
  queryCard,
  addCard,
  updateCard,
  disableCard,
  getCleartips,
  clearAmount,
  getProjectList,
  addProject,
  deleteProject,
  queryDisableCard,
  enableCard,
  deleteCard,
  updateReason,
} from '../services/api';

export default {
  namespace: 'card',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    disabledData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 查询启用卡片
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCard, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 新增卡片
    *add({ payload, callback }, { call }) {
      const response = yield call(addCard, payload);
      if (callback) callback(response);
    },
    // 编辑卡片
    *update({ payload, callback }, { call }) {
      const response = yield call(updateCard, payload);
      if (callback) callback(response);
    },
    // 停用卡片
    *disable({ payload, callback }, { call }) {
      const response = yield call(disableCard, payload);
      if (callback) callback(response);
    },
    // 获取重置信息
    *getCleartips({ callback }, { call }) {
      const response = yield call(getCleartips);
      if (callback) callback(response);
    },
    // 重置数据
    *clearAmount({ callback }, { call }) {
      const response = yield call(clearAmount);
      if (callback) callback(response);
    },
    // 获取专用项目列表数据
    *getProjectList({ callback }, { call, put }) {
      const response = yield call(getProjectList);
      if (response.success) {
        yield put({
          type: 'saveProjectList',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 新增专用项目
    *addProject({ payload, callback }, { call }) {
      const response = yield call(addProject, payload);
      if (callback) callback(response);
    },
    // 删除专用项目
    *deleteProject({ payload, callback }, { call }) {
      const response = yield call(deleteProject, payload);
      if (callback) callback(response);
    },
    // 查询停用卡片
    *fetchDisabledCard({ payload, callback }, { call, put }) {
      const response = yield call(queryDisableCard, payload);
      yield put({
        type: 'saveDisableCardList',
        payload: response,
      });
      if (callback) callback(response);
    },
    // 启用卡片
    *enableCard({ payload, callback }, { call }) {
      const response = yield call(enableCard, payload);
      if (callback) callback(response);
    },
    // 停用卡片
    *deleteCard({ payload, callback }, { call }) {
      const response = yield call(deleteCard, payload);
      if (callback) callback(response);
    },

    // 修改停用卡片停用原因
    *updateReason({ payload, callback }, { call }) {
      const response = yield call(updateReason, payload);
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
    saveProjectList(state, action) {
      return {
        ...state,
        projectList: action.payload.data,
      };
    },
    saveDisableCardList(state, action) {
      return {
        ...state,
        disabledData: action.payload.data,
      };
    },
  },
};
