import React, { PureComponent } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class UpdateModal extends PureComponent {
  okHandle = () => {
    const { form, handleUpdate, selectedRowData } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { nickname, telegramId, potatoId, roleId } = fieldsValue;
      handleUpdate({ userIds: [selectedRowData.id], nickname, telegramId, potatoId, roleId }, form);
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible, loading, roles } = this.props;
    const users = this.props.selectedRowData || {};
    return (
      <Modal
        destroyOnClose
        title="编辑用户"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={loading}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {form.getFieldDecorator('username', {
            initialValue: users.userName,
            rules: [{ required: true, whitespace: true, message: '请输入用户名！' }],
          })(<Input placeholder="请输入用户名" disabled />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {form.getFieldDecorator('nickname', {
            initialValue: users.nickName,
            rules: [{ required: true, whitespace: true, message: '请输入昵称！' }],
          })(<Input placeholder="请输入昵称" disabled />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Telegram">
          {form.getFieldDecorator('telegramId', {
            initialValue: users.telegramId,
            rules: [{ required: true, message: '请输入Telegram！' }],
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入Telegram ID" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Potato">
          {form.getFieldDecorator('potatoId', {
            initialValue: users.potatoId,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入Potato ID！" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {form.getFieldDecorator('roleId', {
            initialValue: users.roleId,
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

export default UpdateModal;
