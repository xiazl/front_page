import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, message, notification, Button } from 'antd';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import Authorized from '@/utils/Authorized';
import { checkAuthority } from '@/utils/authority';
import { authority } from '@/constant';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  state = {
    websocketList: [],
  };

  componentDidMount() {
    if (checkAuthority([authority.operator])) {
      const { webSocketServerInfo, dispatch } = this.props;
      dispatch({
        type: 'global/fetchUnreadNoticeCount',
      });
      if (!webSocketServerInfo) {
        dispatch({
          type: 'global/getWebSocketServerInfo',
          callback: response => {
            if (response.success) {
              this.createWebSocket(response.data);
            }
          },
        });
      } else {
        this.createWebSocket(webSocketServerInfo);
      }
    }
  }

  componentWillUnmount() {
    const { websocketList } = this.state;
    websocketList.forEach(websocket => websocket.close());
  }

  /** 创建WebSocket连接 */
  createWebSocket = webSocketServerInfo => {
    const { ips, port, basePath, userId } = webSocketServerInfo;

    const websocketList = [];
    if ('WebSocket' in window) {
      ips.forEach(ip => {
        const websocket = new ReconnectingWebSocket(
          `ws://${ip}:${port}${basePath}/ws/notice/${userId}`
        );

        websocket.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            notification.open({
              message: data.content,
              description: data.priority === 1 ? <Tag color="#f50">优先</Tag> : null,
              icon: <Icon type="mail" theme="twoTone" />,
              duration: null,
              key: data.id,
              btn: (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => this.markRead(data.id, 'notification')}
                >
                  已读
                </Button>
              ),
            });
            this.props.dispatch({
              type: 'global/addUnreadNoticeCount',
              payload: 1,
            });
          } catch {
            console.error('WebSocket_onmessage-error:', event.data);
          }
        };

        websocketList.push(websocket);
      });
    } else {
      message.error('当前浏览器不支持WebSocket，请使用Chrome等高级浏览器', 10);
      return;
    }

    this.setState({ websocketList });
  };

  /** 标记单个已读 */
  markRead = (id, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/markNoticeRead',
      payload: { id },
      callback: response => {
        if (response.success && type === 'notification') {
          notification.close(id);
        }
      },
    });
  };

  /** 标记全部已读 */
  markAllRead = () => {
    const {
      dispatch,
      notice: { unreadNotices },
    } = this.props;
    dispatch({
      type: 'global/markAllNoticesRead',
      payload: unreadNotices.map(item => item.id),
    });
  };

  onNoticeItemClick = (item, tabProps) => {
    if (tabProps.title === '已读') {
      return;
    }

    this.markRead(item.key);
  };

  onPopupVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
        payload: { status: 0 },
      });
      dispatch({
        type: 'global/fetchNotices',
        payload: { status: 1 },
      });
    }
  };

  getNoticeData = notices =>
    notices.map(notice => {
      const { id, content, priority, createTime } = notice;

      return {
        key: id,
        title: content,
        datetime: createTime,
        extra: priority === 1 ? <Tag color="#f50">优先</Tag> : null,
      };
    });

  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const { currentUser, onMenuClick, theme, notice } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Authorized authority={[authority.operator]}>
          <NoticeIcon
            loading={notice.loading}
            className={styles.action}
            count={notice.unreadNoticeCount}
            onPopupVisibleChange={this.onPopupVisibleChange}
            onItemClick={this.onNoticeItemClick}
            onClear={this.markAllRead}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              title="未读"
              list={this.getNoticeData(notice.unreadNotices)}
              emptyText="没有未读消息"
            />
            <NoticeIcon.Tab
              title="已读"
              list={this.getNoticeData(notice.readNotices)}
              showClear={false}
              emptyText="近7天没有已读消息"
            />
          </NoticeIcon>
        </Authorized>

        {currentUser.nickName ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.nickName}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
