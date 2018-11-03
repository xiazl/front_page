import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, message } from 'antd';
import styles from './index.less';
import encrypt from '@/utils/encrypt';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
@connect(({ setting, loading, user }) => ({
  setting,
  currentUser: user.currentUser,
  loading: loading.models.setting,
  updatePasswordLoading: loading.effects['users/password'],
}))
@Form.create()
class ResetPw extends Component {
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  // 编辑
  handleSave = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/password',
      payload: fields,
      callback: response => {
        if (response.success) {
          message.success('修改成功');
        }
      },
    });
  };

  handSubmit = () => {
    const { currentUser } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { newPassword, password } = fieldsValue;
      this.handleSave({
        newPassword: encrypt(newPassword),
        password: encrypt(password),
        id: currentUser.id,
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      updatePasswordLoading,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <Card style={{ width: '100%' }}>
          <div className={styles.settings_info_title}>{/* <span>修改密码</span> */}</div>
          <div className={styles.left}>
            <Form layout="vertical">
              <FormItem label="旧密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, whitespace: true, message: '请输入旧密码！' }],
                })(<Input placeholder="请输入旧密码" type="password" />)}
              </FormItem>
              <FormItem label="新密码">
                {getFieldDecorator('newPassword', {
                  rules: [{ required: true, whitespace: true, message: '请输入新密码！' }],
                })(<Input placeholder="请输入新密码" type="password" rows={8} />)}
              </FormItem>
              <FormItem label="确认新密码">
                {getFieldDecorator('newPasswordConfirm', {
                  rules: [
                    { required: true, whitespace: true, message: '请再次输入新密码！' },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(<Input placeholder="请再次输入新密码" type="password" />)}
              </FormItem>

              <Button type="primary" loading={updatePasswordLoading} onClick={this.handSubmit}>
                保存
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}

export default ResetPw;
