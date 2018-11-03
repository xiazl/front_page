import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Info from './Info';
import ResetPw from './ResetPw';
import styles from './index.less';

const { Item } = Menu;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class Profile extends Component {
  constructor(props) {
    super(props);
    const menuMap = {
      info: { title: '基本信息', content: <Info /> },
      reset: { title: '修改密码', content: <ResetPw /> },
    };

    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'info',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item].title}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey].title;
  };

  selectKey = ({ key }) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
    const { mode, selectKey, menuMap } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey}>
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {menuMap[selectKey].content}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Profile;
