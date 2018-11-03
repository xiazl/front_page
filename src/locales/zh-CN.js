// import zhMessages from '../../locales/zh.json';
import 'moment/locale/zh-cn';

export default {
  /** 菜单国际化 */
  'navbar.lang': 'English',
  'menu.home': '首页',

  'menu.exception': '异常页',
  'menu.exception.not-permission': '403',
  'menu.exception.not-find': '404',
  'menu.exception.server-error': '500',
  'menu.exception.trigger': '触发错误',

  'menu.account': '个人页',
  'menu.account.center': '个人中心',
  'menu.account.settings': '个人设置',
  'menu.account.trigger': '触发报错',
  'menu.account.logout': '退出登录',

  'menu.card': '卡片管理',
  'menu.card.enabledList': '卡片列表',
  'menu.card.disabledList': '停用卡片列表',

  'menu.statistic': '统计数据',
  'menu.statistic.cardStatisticList': '卡片统计',
  'menu.statistic.projectStatisticList': '项目统计',
  'menu.statistic.batchStatisticList': '批次统计',
  'menu.statistic.taskStatisticList': '任务统计',
  'menu.statistic.balanceStatistic': '余额统计',

  'menu.billing': '出账管理',
  'menu.billing.createBilling': '创建任务',
  'menu.billing.taskDetail': '任务明细',
  'menu.billing.billingDetail': '出账详情',

  'menu.task': '业务管理',
  'menu.task.teamStatistic': '小组统计',
  'menu.task.create': '创建任务',
  'menu.task.registration': '出入账登记',
  'menu.task.depositList': '入账明细',
  'menu.task.billingList': '出账明细',
  'menu.task.cardBalance': '卡片余额',
  'menu.task.cardChange': '卡片变更记录',
  'menu.task.showTask': '查看任务',

  'menu.user': '用户管理',
  'menu.user.list': '用户列表',
  'menu.user.profile': '个人设置',
  'menu.user.group': '小组列表',
  'app.profile.menuMap.info': '个人信息',
  'app.profile.menuMap.reset': '修改密码',

  'menu.settings': ' 系统设置',
  'menu.settings.system': '系统参数',

  'menu.dailyData': '每日数据',

  /** 页面国际化 */
  'app.exception.back': '返回首页',
  'app.exception.description.403': '抱歉，你无权访问该页面',
  'app.exception.description.404': '抱歉，你访问的页面不存在',
  'app.exception.description.500': '抱歉，服务器出错了',

  'app.setting.pagestyle': '整体风格设置',
  'app.setting.pagestyle.dark': '暗色菜单风格',
  'app.setting.pagestyle.light': '亮色菜单风格',
  'app.setting.content-width': '内容区域宽度',
  'app.setting.content-width.fixed': '定宽',
  'app.setting.content-width.fluid': '流式',
  'app.setting.themecolor': '主题色',
  'app.setting.themecolor.dust': '薄暮',
  'app.setting.themecolor.volcano': '火山',
  'app.setting.themecolor.sunset': '日暮',
  'app.setting.themecolor.cyan': '明青',
  'app.setting.themecolor.green': '极光绿',
  'app.setting.themecolor.daybreak': '拂晓蓝（默认）',
  'app.setting.themecolor.geekblue': '极客蓝',
  'app.setting.themecolor.purple': '酱紫',
  'app.setting.navigationmode': '导航模式',
  'app.setting.sidemenu': '侧边菜单布局',
  'app.setting.topmenu': '顶部菜单布局',
  'app.setting.fixedheader': '固定 Header',
  'app.setting.fixedsidebar': '固定侧边菜单',
  'app.setting.fixedsidebar.hint': '侧边菜单布局时可配置',
  'app.setting.hideheader': '下滑时隐藏 Header',
  'app.setting.hideheader.hint': '固定 Header 时可配置',
  'app.setting.othersettings': '其他设置',
  'app.setting.weakmode': '色弱模式',
  'app.setting.copy': '拷贝设置',
  'app.setting.copyinfo': '拷贝成功，请到 src/defaultSettings.js 中替换默认配置',
  'app.setting.production.hint':
    '配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改配置文件',
};
