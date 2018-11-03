import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  
});

window.g_app = app;
app.use(createLoading());

app.model({ namespace: 'global', ...(require('/Users/baidu/workspace/finance_smart_fe/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/baidu/workspace/finance_smart_fe/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/baidu/workspace/finance_smart_fe/src/models/login.js').default) });
app.model({ namespace: 'project', ...(require('/Users/baidu/workspace/finance_smart_fe/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/baidu/workspace/finance_smart_fe/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/baidu/workspace/finance_smart_fe/src/models/user.js').default) });
app.model({ namespace: 'user', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/User/models/user.js').default) });
app.model({ namespace: 'dailyData', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/DailyData/models/dailyData.js').default) });
app.model({ namespace: 'error', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Exception/models/error.js').default) });
app.model({ namespace: 'group', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/User/UserGroup/models/group.js').default) });
app.model({ namespace: 'teamStatistic', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Statistic/Team/models/teamStatistic.js').default) });
app.model({ namespace: 'createTask', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/Create/models/createTask.js').default) });
app.model({ namespace: 'showTask', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/Show/models/showTask.js').default) });
app.model({ namespace: 'registration', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/Registration/models/registration.js').default) });
app.model({ namespace: 'deposit', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/Deposit/models/deposit.js').default) });
app.model({ namespace: 'billing', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/Billing/models/billing.js').default) });
app.model({ namespace: 'cardBalance', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/CardBalance/models/cardBalance.js').default) });
app.model({ namespace: 'cardChange', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Task/CardChange/models/cardChange.js').default) });
app.model({ namespace: 'task', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Billing/CreateBilling/models/task.js').default) });
app.model({ namespace: 'list', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Billing/TaskDetail/models/list.js').default) });
app.model({ namespace: 'detail', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Billing/BillingDetail/models/detail.js').default) });
app.model({ namespace: 'card', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Card/models/card.js').default) });
app.model({ namespace: 'cardStatistic', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Statistic/Card/models/cardStatistic.js').default) });
app.model({ namespace: 'projectStatistic', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Statistic/Project/models/projectStatistic.js').default) });
app.model({ namespace: 'batchStatistic', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Statistic/Batch/models/batchStatistic.js').default) });
app.model({ namespace: 'taskStatistic', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Statistic/Task/models/taskStatistic.js').default) });
app.model({ namespace: 'balanceStatistic', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Statistic/Balance/models/balanceStatistic.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/baidu/workspace/finance_smart_fe/src/pages/Setting/models/setting.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
