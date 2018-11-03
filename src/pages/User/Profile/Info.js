import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, message } from 'antd';
import styles from './index.less';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
@connect(({ users, loading, user }) => ({
  users,
  loading: loading.models.users,
  currentUser: user.currentUser,
  saveLoading: loading.effects['users/updateInfo'],
}))
@Form.create()
class Info extends Component {
  state = {
    info: [],
  };

  componentDidMount() {
    this.listInfo();
  }

  listInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/listInfo',
      callback: response => {
        if (response.success) {
          this.setState({
            info: response.data,
          });
        }
      },
    });
  };

  // 编辑
  handleSave = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/updateInfo',
      payload: fields,
      callback: response => {
        if (response.success) {
          message.success('保存成功');
        }
      },
    });
  };

  handSubmit = () => {
    const { currentUser } = this.props;

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleSave({ ...fieldsValue, id: currentUser.id });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      saveLoading,
    } = this.props;
    const { info } = this.state;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <Card style={{ width: '100%' }}>
          <div className={styles.settings_info_title}>{/* <span>个人基本信息修改</span> */}</div>
          <div className={styles.left}>
            <Form layout="vertical">
              <FormItem label="用户名">
                {getFieldDecorator('userName', {
                  initialValue: info.userName,
                  rules: [{ required: true, whitespace: true, message: '请输入用户名！' }],
                })(<Input placeholder="请输入用户名" disabled />)}
              </FormItem>
              <FormItem label="昵称">
                {getFieldDecorator('nickName', {
                  initialValue: info.nickName,
                  rules: [{ required: true, whitespace: true, message: '请输入昵称！' }],
                })(<Input placeholder="请输入昵称" rows={8} disabled />)}
              </FormItem>
              <FormItem label="Telegram">
                {getFieldDecorator('telegramId', {
                  initialValue: info.telegramId,
                  rules: [{ required: true, message: '请输入Telegram ID！' }],
                })(<Input placeholder="请输入Telegram" />)}
              </FormItem>
              <FormItem label="Potato">
                {getFieldDecorator('potatoId', {
                  initialValue: info.potatoId,
                })(<Input placeholder="请输入Potato ID！" />)}
              </FormItem>
              <Button type="primary" loading={saveLoading} onClick={this.handSubmit}>
                保存
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}

export default Info;
