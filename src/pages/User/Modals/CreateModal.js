import React, { PureComponent } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import encrypt from '@/utils/encrypt';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class CreateModal extends PureComponent {
  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { password, ...rest } = fieldsValue;
      handleAdd({ ...rest, password: encrypt(password) }, form);
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible, loading, roles } = this.props;
    return (
      <Modal
        destroyOnClose
        title="新增用户"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={loading}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {form.getFieldDecorator('username', {
            rules: [{ required: true, whitespace: true, message: '请输入用户名！' }],
          })(<Input placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          {form.getFieldDecorator('password', {
            rules: [{ required: true, whitespace: true, message: '请输入密码！' }],
          })(<Input placeholder="请输入密码" type="password" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {form.getFieldDecorator('nickname', {
            validateFirst: true,
            rules: [{ required: true, whitespace: true, message: '请输入昵称！' }],
          })(<Input placeholder="请输入昵称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Telegram">
          {form.getFieldDecorator('telegramId', {
            rules: [{ required: true, message: '请输入Telegram！' }],
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入Telegram" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Potato">
          {form.getFieldDecorator('potatoId', {})(
            <InputNumber style={{ width: '100%' }} placeholder="请输入Potato ID" />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {form.getFieldDecorator('roleId', {
            rules: [{ required: true, message: '请选择角色！' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择角色"
              onChange={this.handleRoleChange}
            >
              {roles.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.roleName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default CreateModal;
