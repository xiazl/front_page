import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, message } from 'antd';
import styles from './SettingPage.less';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
@connect(({ setting, loading }) => ({
  setting,
  loading: loading.models.setting,
}))
@Form.create()
class SettingPage extends Component {
  state = {
    settings: [],
  };

  componentDidMount() {
    this.listSetting();
  }

  listSetting = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settings/fetch',
      callback: response => {
        if (response.success) {
          this.setState({
            settings: response.data,
          });
        }
      },
    });
  };

  // 编辑
  handleSave = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settings/update',
      payload: fields,
      callback: response => {
        if (response.success) {
          message.success('保存成功');
        }
      },
    });
  };

  handSubmit = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const param = [];
      Object.keys(fieldsValue).forEach(i => {
        param.push({ key: i, value: fieldsValue[i] });
      });
      this.handleSave(param);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { settings } = this.state;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <Card style={{ width: '100%' }}>
          <div className={styles.settings_info_title}>
            <span>基本设置</span>
          </div>
          <div className={styles.left}>
            <Form layout="vertical">
              <FormItem label="任务占比报警阀值">
                {getFieldDecorator('task_warning', {
                  initialValue: settings.task_warning,
                  rules: [{ required: true, whitespace: true, message: '请输入设定值！' }],
                })(<Input placeholder="请输入设定值" />)}
              </FormItem>
              <FormItem label="自动审计允许差额">
                {getFieldDecorator('amount_warning', {
                  initialValue: settings.amount_warning,
                  rules: [{ required: true, whitespace: true, message: '请输入设定值！' }],
                })(<Input placeholder="请输入设定值" rows={8} />)}
              </FormItem>
              <FormItem label="出账取整超额限制">
                {getFieldDecorator('amount_wd_ceiling', {
                  initialValue: settings.amount_wd_ceiling,
                  rules: [{ required: true, whitespace: true, message: '请输入设定值！' }],
                })(<Input placeholder="请输入设定值" />)}
              </FormItem>

              <Button type="primary" onClick={this.handSubmit}>
                保存
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}

export default SettingPage;
