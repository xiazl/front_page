import { authority } from '../src/constant';

export default [
  // user 登录
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [{ path: '/login', component: './User/Login' }],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: [
      authority.operator,
      authority.teamleader,
      authority.auditor,
      authority.cardmanager,
      authority.admin,
      authority.superadmin,
      authority.billingmanager,
    ],
    routes: [
      // index
      { path: '/', name: 'home', icon: 'home', hideInMenu: true, component: './Index' },
      // 每日数据
      {
        path: '/daily-data',
        name: 'dailyData',
        icon: 'dashboard',
        component: './DailyData',
        authority: [
          authority.superadmin,
          authority.admin,
          authority.auditor,
          authority.cardmanager,
        ],
      },
      // 异常页面
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      // 用户管理
      {
        name: 'user',
        icon: 'user',
        path: '/user',
        routes: [
          {
            path: '/user/list',
            name: 'list',
            component: './User/UserList',
            authority: [authority.admin, authority.superadmin],
          },
          {
            path: '/user/group',
            name: 'group',
            component: './User/UserGroup/GroupList',
            authority: [authority.admin, authority.superadmin, authority.cardmanager],
          },
          {
            path: '/user/profile',
            name: 'profile',
            component: './User/Profile',
          },
        ],
      },
      // 业务管理
      {
        name: 'task',
        icon: 'dollar',
        path: '/task',
        authority: [
          authority.teamleader,
          authority.operator,
          authority.auditor,
          authority.cardmanager,
          authority.superadmin,
          authority.admin,
        ],
        routes: [
          // 小组统计
          {
            path: '/task/team-statistic',
            name: 'teamStatistic',
            component: './Statistic/Team/TeamStatisticList',
            authority: [authority.teamleader, authority.operator],
          },
          // 创建任务
          {
            path: '/task/create',
            name: 'create',
            component: './Task/Create/CreateTaskList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 查看任务
          {
            path: '/task/show-task',
            name: 'showTask',
            component: './Task/Show/ShowTaskList',
            authority: [
              authority.auditor,
              authority.cardmanager,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 出入账登记
          {
            path: '/task/registration',
            name: 'registration',
            component: './Task/Registration/RegistrationList',
            authority: [authority.operator, authority.teamleader],
          },
          // 入账明细
          {
            path: '/task/deposit',
            name: 'depositList',
            component: './Task/Deposit/DepositList',
            authority: [
              authority.auditor,
              authority.admin,
              authority.superadmin,
              authority.operator,
              authority.teamleader,
            ],
          },
          // 出账明细
          {
            path: '/task/billing',
            name: 'billingList',
            component: './Task/Billing/BillingList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
              authority.operator,
              authority.teamleader,
            ],
          },
          // 卡片余额
          {
            path: '/task/card-balance',
            name: 'cardBalance',
            component: './Task/CardBalance/CardBalanceList',
            authority: [
              authority.operator,
              authority.teamleader,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 卡片变更记录
          {
            path: '/task/card-change',
            name: 'cardChange',
            component: './Task/CardChange/CardChangeList',
            authority: [authority.cardmanager, authority.admin, authority.superadmin],
          },
        ],
      },
      // 出账管理
      {
        name: 'billing',
        icon: 'table',
        path: '/billing',
        authority: [
          authority.admin,
          authority.superadmin,
          authority.billingmanager,
          authority.auditor,
          authority.operator,
          authority.teamleader,
        ],
        routes: [
          {
            path: '/billing/task',
            name: 'createBilling',
            component: './Billing/CreateBilling',
            authority: [
              authority.billingmanager,
              authority.admin,
              authority.superadmin,
              authority.auditor,
            ],
          },
          {
            path: '/billing/list',
            name: 'taskDetail',
            component: './Billing/TaskDetail/TaskDetail',
            authority: [
              authority.billingmanager,
              authority.admin,
              authority.superadmin,
              authority.auditor,
            ],
          },
          {
            path: '/billing/detail',
            name: 'billingDetail',
            component: './Billing/BillingDetail',
          },
        ],
      },
      // 卡片管理
      {
        path: '/card',
        icon: 'credit-card',
        name: 'card',
        authority: [
          authority.cardmanager,
          authority.auditor,
          authority.admin,
          authority.superadmin,
        ],
        routes: [
          {
            path: '/card/enabled-list',
            name: 'enabledList',
            component: './Card/EnabledList',
            authority: [authority.cardmanager, authority.admin, authority.superadmin],
          },
          {
            path: '/card/disabled-list',
            name: 'disabledList',
            component: './Card/DisabledList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
        ],
      },
      // 统计数据
      {
        path: '/statistic',
        icon: 'bar-chart',
        name: 'statistic',
        authority: [
          authority.cardmanager,
          authority.auditor,
          authority.admin,
          authority.superadmin,
          authority.billingmanager,
        ],
        routes: [
          // 卡片统计
          {
            path: '/statistic/card',
            name: 'cardStatisticList',
            component: './Statistic/Card/CardStatisticList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 项目统计
          {
            path: '/statistic/project',
            name: 'projectStatisticList',
            component: './Statistic/Project/ProjectStatisticList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 批次统计
          {
            path: '/statistic/batch',
            name: 'batchStatisticList',
            component: './Statistic/Batch/BatchStatisticList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 任务统计
          {
            path: '/statistic/task',
            name: 'taskStatisticList',
            component: './Statistic/Task/TaskStatisticList',
            authority: [
              authority.cardmanager,
              authority.auditor,
              authority.admin,
              authority.superadmin,
            ],
          },
          // 余额统计
          {
            path: '/statistic/balance',
            name: 'balanceStatistic',
            component: './Statistic/Balance/index-v2',
            authority: [authority.admin, authority.superadmin, authority.billingmanager],
          },
        ],
      },
      //  系统设置
      {
        name: 'settings',
        icon: 'setting',
        path: '/settings',
        authority: [authority.admin, authority.superadmin],
        routes: [
          {
            path: '/settings/list',
            name: 'system',
            component: './Setting/SettingPage',
            authority: [authority.admin, authority.superadmin],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
