import { queryTeamBalance, queryCardBalance, queryTeamStatistics } from '../services/api';

export default {
  namespace: 'balanceStatistic',

  state: {
    teamBalance: [],
    cardBalance: [],
    teamStatistics: [],
  },

  effects: {
    // 查询小组余额
    *queryTeamBalance({ callback }, { call, put }) {
      const response = yield call(queryTeamBalance);
      if (response.success) {
        yield put({
          type: 'saveTeamBalance',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    // 查询卡片余额
    *queryCardBalance({ callback }, { call, put }) {
      const response = yield call(queryCardBalance);
      if (response.success) {
        yield put({
          type: 'saveCardBalance',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
    // 查询小组统计
    *queryTeamStatistics({ callback }, { call, put }) {
      const response = yield call(queryTeamStatistics);
      if (response.success) {
        yield put({
          type: 'saveTeamStatistics',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    saveTeamBalance(state, action) {
      return {
        ...state,
        teamBalance: action.payload || [],
      };
    },
    saveCardBalance(state, action) {
      return {
        ...state,
        cardBalance: action.payload || [],
      };
    },
    saveTeamStatistics(state, action) {
      return {
        ...state,
        teamStatistics: action.payload || [],
      };
    },
  },
};
