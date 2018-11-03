import {
  queryTaskList,
  queryAllGroupNames,
  queryAllProjectNames,
  queryAllBankNames,
  saveTask,
  updateBatchName,
  deleteProjectTask,
  addNewCard,
  checkBatchDetails,
} from '@/pages/Task/Create/services/api';

export default {
  namespace: 'createTask',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    groupNames: [],
    projectNames: [],
    bankNames: [],
  },

  effects: {
    // 查询任务统计数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTaskList, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    *queryAllGroupNames({ callback }, { call, put }) {
      const response = yield call(queryAllGroupNames);
      if (response.success) {
        yield put({
          type: 'saveGroupNames',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    *queryAllProjectNames({ callback }, { call, put }) {
      const response = yield call(queryAllProjectNames);
      if (response.success) {
        yield put({
          type: 'saveProjectNames',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    *queryAllBankNames({ callback }, { call, put }) {
      const response = yield call(queryAllBankNames);
      if (response.success) {
        yield put({
          type: 'saveBankNames',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    *saveTask({ payload, callback }, { call }) {
      const response = yield call(saveTask, payload);
      if (callback) callback(response);
    },
    *updateBatchName({ payload, callback }, { call }) {
      const response = yield call(updateBatchName, payload);
      if (callback) callback(response);
    },
    *deleteProjectTask({ payload, callback }, { call }) {
      const response = yield call(deleteProjectTask, payload);
      if (callback) callback(response);
    },
    *addNewCard({ payload, callback }, { call }) {
      const response = yield call(addNewCard, payload);
      if (callback) callback(response);
    },
    *checkBatchDetails({ payload, callback }, { call }) {
      const response = yield call(checkBatchDetails, payload);
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
    saveGroupNames(state, action) {
      return {
        ...state,
        groupNames: action.payload,
      };
    },
    saveProjectNames(state, action) {
      return {
        ...state,
        projectNames: action.payload,
      };
    },
    saveBankNames(state, action) {
      return {
        ...state,
        bankNames: action.payload,
      };
    },
  },
};
