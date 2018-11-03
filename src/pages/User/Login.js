import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import encrypt from '@/utils/encrypt';

const { Tab, UserName, Password, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      const form = this.loginForm;
      this.loginForm.validateFields(['userName'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: {
              userName: values.userName,
              resolve,
              form,
            },
          }).catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const { password, ...rest } = values;
      dispatch({
        type: 'login/login',
        payload: {
          ...rest,
          password: encrypt(password),
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={`${SYS_NAME}登录`}>
            {login.status === false && !submitting && this.renderMessage(login.message)}
            <UserName name="userName" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
            <Captcha
              name="verificationCode"
              placeholder="验证码"
              countDown={60}
              onGetCaptcha={this.onGetCaptcha}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>

          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
