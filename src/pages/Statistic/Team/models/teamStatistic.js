import moment from 'moment';
import queryTeamStatistic from '../services/api';

export default {
  namespace: 'teamStatistic',

  state: {
    data: {
      body: [],
      head: [],
      time: moment().valueOf(),
    },
  },

  effects: {
    // 查询小组统计数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTeamStatistic, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: { ...payload, time: moment().valueOf() },
      };
    },
  },
};
