import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const UpdateModal = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading, card = {} } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate({ ...fieldsValue, id: card.id }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑卡片"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="银行">
        {form.getFieldDecorator('bankName', {
          initialValue: card.bankName,
          rules: [{ required: true, whitespace: true, message: '请输入银行名称！' }],
        })(<Input placeholder="请输入银行名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="户名">
        {form.getFieldDecorator('owner', {
          initialValue: card.owner,
          rules: [{ required: true, whitespace: true, message: '请输入户名！' }],
        })(<Input placeholder="请输入户名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卡号">
        {form.getFieldDecorator('cardNo', {
          initialValue: card.cardNo,
          rules: [{ required: true, whitespace: true, message: '请输入卡号！' }],
        })(<Input placeholder="请输入卡号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开户省">
        {form.getFieldDecorator('province', {
          initialValue: card.province,
          rules: [{ required: true, whitespace: true, message: '请输入开户省！' }],
        })(<Input placeholder="请输入开户省" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开户市">
        {form.getFieldDecorator('city', {
          initialValue: card.city,
          rules: [{ required: true, whitespace: true, message: '请输入开户市！' }],
        })(<Input placeholder="请输入开户市" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开户行">
        {form.getFieldDecorator('branchName', {
          initialValue: card.branchName,
          rules: [{ required: true, whitespace: true, message: '请输入开户分行地址！' }],
        })(<Input placeholder="请输入开户分行地址" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="小组">
        {form.getFieldDecorator('operatorTeam', {
          initialValue: card.operatorTeam,
          rules: [{ required: true, whitespace: true, message: '请输入组员所属小组名称！' }],
        })(<Input placeholder="请输入组员所属小组名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目">
        {form.getFieldDecorator('operatorProject', {
          initialValue: card.operatorProject,
          rules: [{ required: true, whitespace: true, message: '请输入组员所属项目名称！' }],
        })(<Input placeholder="请输入组员所属项目名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组员">
        {form.getFieldDecorator('operatorNickName', {
          initialValue: card.operatorNickName,
          rules: [{ required: true, whitespace: true, message: '请输入组员昵称！' }],
        })(<Input placeholder="请输入组员昵称" />)}
      </FormItem>
    </Modal>
  );
});

export default UpdateModal;
