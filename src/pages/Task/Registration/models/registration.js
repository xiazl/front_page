import {
  queryRegistrationList,
  queryRegistrationListTotal,
  addDepositByTxt,
  addBillingByTxt,
  addDeposit,
  addBilling,
  queryDepositDetails,
  queryBillingDetails,
} from '../services/api';

export default {
  namespace: 'registration',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    total: {},
  },

  effects: {
    // 查询任务统计数据
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRegistrationList, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    *fetchTotal({ payload, callback }, { call, put }) {
      const response = yield call(queryRegistrationListTotal, payload);
      if (response.success) {
        yield put({
          type: 'saveTotal',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 通过文本增加入账记录
    *addDepositByTxt({ payload, callback }, { call }) {
      const response = yield call(addDepositByTxt, payload);
      if (callback) callback(response);
    },
    // 通过文本增加出账记录
    *addBillingByTxt({ payload, callback }, { call }) {
      const response = yield call(addBillingByTxt, payload);
      if (callback) callback(response);
    },
    // 新增入账记录
    *addDeposit({ payload, callback }, { call }) {
      const response = yield call(addDeposit, payload);
      if (callback) callback(response);
    },
    // 新增出账记录
    *addBilling({ payload, callback }, { call }) {
      const response = yield call(addBilling, payload);
      if (callback) callback(response);
    },
    // 查询入账明细
    *queryDepositDetails({ payload, callback }, { call, put }) {
      const response = yield call(queryDepositDetails, payload);
      if (response.success) {
        yield put({
          type: 'saveDepositDetialList',
          payload: response,
        });
      }
      if (callback) callback(response);
    },
    // 查询出账明细
    *queryBillingDetails({ payload, callback }, { call, put }) {
      const response = yield call(queryBillingDetails, payload);
      if (response.success) {
        yield put({
          type: 'saveBillingDetialList',
          payload: response,
        });
      }
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
    saveTotal(state, action) {
      return {
        ...state,
        total: action.payload.data || {},
      };
    },
    saveDepositDetialList(state, action) {
      return {
        ...state,
        depositDetailList: action.payload.data,
      };
    },
    saveBillingDetialList(state, action) {
      return {
        ...state,
        billingDetailList: action.payload.data,
      };
    },
  },
};
