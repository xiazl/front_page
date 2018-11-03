import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/baidu/workspace/finance_smart_fe/src/pages/.umi/LocaleWrapper.jsx'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/login",
    "component": dynamic({ loader: () => import('../../layouts/UserLayout'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
    "routes": [
      {
        "path": "/login",
        "component": dynamic({ loader: () => import('../User/Login'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import('../../layouts/BasicLayout'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
    "Routes": [require('../Authorized').default],
    "authority": [
      "operator",
      "teamleader",
      "auditor",
      "cardmanager",
      "admin",
      "superadmin",
      "billingmanager"
    ],
    "routes": [
      {
        "path": "/",
        "name": "home",
        "icon": "home",
        "hideInMenu": true,
        "component": dynamic({ loader: () => import('../Index'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
        "exact": true
      },
      {
        "path": "/daily-data",
        "name": "dailyData",
        "icon": "dashboard",
        "component": dynamic({ loader: () => import('../DailyData'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
        "authority": [
          "superadmin",
          "admin",
          "auditor",
          "cardmanager"
        ],
        "exact": true
      },
      {
        "name": "exception",
        "icon": "warning",
        "path": "/exception",
        "hideInMenu": true,
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": dynamic({ loader: () => import('../Exception/403'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": dynamic({ loader: () => import('../Exception/404'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": dynamic({ loader: () => import('../Exception/500'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import('../Exception/TriggerException'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "user",
        "icon": "user",
        "path": "/user",
        "routes": [
          {
            "path": "/user/list",
            "name": "list",
            "component": dynamic({ loader: () => import('../User/UserList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/user/group",
            "name": "group",
            "component": dynamic({ loader: () => import('../User/UserGroup/GroupList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "superadmin",
              "cardmanager"
            ],
            "exact": true
          },
          {
            "path": "/user/profile",
            "name": "profile",
            "component": dynamic({ loader: () => import('../User/Profile'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "task",
        "icon": "dollar",
        "path": "/task",
        "authority": [
          "teamleader",
          "operator",
          "auditor",
          "cardmanager",
          "superadmin",
          "admin"
        ],
        "routes": [
          {
            "path": "/task/team-statistic",
            "name": "teamStatistic",
            "component": dynamic({ loader: () => import('../Statistic/Team/TeamStatisticList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "teamleader",
              "operator"
            ],
            "exact": true
          },
          {
            "path": "/task/create",
            "name": "create",
            "component": dynamic({ loader: () => import('../Task/Create/CreateTaskList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/task/show-task",
            "name": "showTask",
            "component": dynamic({ loader: () => import('../Task/Show/ShowTaskList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "auditor",
              "cardmanager",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/task/registration",
            "name": "registration",
            "component": dynamic({ loader: () => import('../Task/Registration/RegistrationList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "operator",
              "teamleader"
            ],
            "exact": true
          },
          {
            "path": "/task/deposit",
            "name": "depositList",
            "component": dynamic({ loader: () => import('../Task/Deposit/DepositList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "auditor",
              "admin",
              "superadmin",
              "operator",
              "teamleader"
            ],
            "exact": true
          },
          {
            "path": "/task/billing",
            "name": "billingList",
            "component": dynamic({ loader: () => import('../Task/Billing/BillingList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin",
              "operator",
              "teamleader"
            ],
            "exact": true
          },
          {
            "path": "/task/card-balance",
            "name": "cardBalance",
            "component": dynamic({ loader: () => import('../Task/CardBalance/CardBalanceList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "operator",
              "teamleader",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/task/card-change",
            "name": "cardChange",
            "component": dynamic({ loader: () => import('../Task/CardChange/CardChangeList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "billing",
        "icon": "table",
        "path": "/billing",
        "authority": [
          "admin",
          "superadmin",
          "billingmanager",
          "auditor",
          "operator",
          "teamleader"
        ],
        "routes": [
          {
            "path": "/billing/task",
            "name": "createBilling",
            "component": dynamic({ loader: () => import('../Billing/CreateBilling'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "billingmanager",
              "admin",
              "superadmin",
              "auditor"
            ],
            "exact": true
          },
          {
            "path": "/billing/list",
            "name": "taskDetail",
            "component": dynamic({ loader: () => import('../Billing/TaskDetail/TaskDetail'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "billingmanager",
              "admin",
              "superadmin",
              "auditor"
            ],
            "exact": true
          },
          {
            "path": "/billing/detail",
            "name": "billingDetail",
            "component": dynamic({ loader: () => import('../Billing/BillingDetail'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/card",
        "icon": "credit-card",
        "name": "card",
        "authority": [
          "cardmanager",
          "auditor",
          "admin",
          "superadmin"
        ],
        "routes": [
          {
            "path": "/card/enabled-list",
            "name": "enabledList",
            "component": dynamic({ loader: () => import('../Card/EnabledList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/card/disabled-list",
            "name": "disabledList",
            "component": dynamic({ loader: () => import('../Card/DisabledList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/statistic",
        "icon": "bar-chart",
        "name": "statistic",
        "authority": [
          "cardmanager",
          "auditor",
          "admin",
          "superadmin",
          "billingmanager"
        ],
        "routes": [
          {
            "path": "/statistic/card",
            "name": "cardStatisticList",
            "component": dynamic({ loader: () => import('../Statistic/Card/CardStatisticList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/statistic/project",
            "name": "projectStatisticList",
            "component": dynamic({ loader: () => import('../Statistic/Project/ProjectStatisticList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/statistic/batch",
            "name": "batchStatisticList",
            "component": dynamic({ loader: () => import('../Statistic/Batch/BatchStatisticList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/statistic/task",
            "name": "taskStatisticList",
            "component": dynamic({ loader: () => import('../Statistic/Task/TaskStatisticList'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "cardmanager",
              "auditor",
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "path": "/statistic/balance",
            "name": "balanceStatistic",
            "component": dynamic({ loader: () => import('../Statistic/Balance/index-v2'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "superadmin",
              "billingmanager"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "settings",
        "icon": "setting",
        "path": "/settings",
        "authority": [
          "admin",
          "superadmin"
        ],
        "routes": [
          {
            "path": "/settings/list",
            "name": "system",
            "component": dynamic({ loader: () => import('../Setting/SettingPage'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
            "authority": [
              "admin",
              "superadmin"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('../404'), loading: require('/Users/baidu/workspace/finance_smart_fe/src/components/PageLoading/index').default  }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/baidu/workspace/finance_smart_fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];

export default function() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
