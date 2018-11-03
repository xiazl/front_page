import queryTaskList, {
  changeCard,
  removeCard,
  editAmountShould,
  queryMatchedRecord,
  queryNotMatchedRecord,
  bundling,
  removeBundling,
  setExtraDeposit,
  getWebSocketServerInfo,
  openOrClosedAutoMatch,
} from '../services/api';

export default {
  namespace: 'showTask',

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
    // 更换卡片
    *changeCard({ payload, callback }, { call }) {
      const response = yield call(changeCard, payload);
      if (callback) callback(response);
    },
    // 移除卡片
    *removeCard({ payload, callback }, { call }) {
      const response = yield call(removeCard, payload);
      if (callback) callback(response);
    },
    // 编辑应收
    *editAmountShould({ payload, callback }, { call }) {
      const response = yield call(editAmountShould, payload);
      if (callback) callback(response);
    },
    // 查询匹配记录
    *queryMatchedRecord({ payload, callback }, { call }) {
      const response = yield call(queryMatchedRecord, payload);
      if (callback) callback(response);
    },
    // 查询未匹配记录
    *queryNotMatchedRecord({ payload, callback }, { call }) {
      const response = yield call(queryNotMatchedRecord, payload);
      if (callback) callback(response);
    },
    // 绑定
    *bundling({ payload, callback }, { call }) {
      const response = yield call(bundling, payload);
      if (callback) callback(response);
    },
    // 解除绑定
    *removeBundling({ payload, callback }, { call }) {
      const response = yield call(removeBundling, payload);
      if (callback) callback(response);
    },
    // 转额外收入
    *setExtraDeposit({ payload, callback }, { call }) {
      const response = yield call(setExtraDeposit, payload);
      if (callback) callback(response);
    },
    // 获取WebSocket服务信息
    *getWebSocketServerInfo({ callback }, { call }) {
      const response = yield call(getWebSocketServerInfo);
      if (callback) callback(response);
    },
    // 打开或关闭自动审计
    *openOrClosedAutoMatch({ payload, callback }, { call }) {
      const response = yield call(openOrClosedAutoMatch, payload);
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
