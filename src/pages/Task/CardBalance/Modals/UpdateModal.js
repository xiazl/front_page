import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const UpdateModal = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading } = props;
  const balance = props.selectRows || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate({ ...fieldsValue, cardId: balance.id }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑余额"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卡号">
        {form.getFieldDecorator('cardNo', {
          initialValue: balance.cardNo,
          rules: [{ required: true, whitespace: true, message: '请输入卡号！' }],
        })(<Input placeholder="请输入卡号" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日期">
        {form.getFieldDecorator('date', {
          initialValue: balance.date,
          rules: [{ required: true, whitespace: true, message: '请输入日期！' }],
        })(<Input placeholder="请输入日期" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="理论余额">
        {form.getFieldDecorator('theoryAmount', {
          initialValue: balance.theoryAmount === null ? '' : `${balance.theoryAmount}`,
          rules: [{ required: true, whitespace: true, message: '请输入理论余额！' }],
        })(<Input placeholder="请输入理论余额" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实际余额">
        {form.getFieldDecorator('realAmount', {
          initialValue: balance.realAmount === null ? '' : `${balance.realAmount}`,
          rules: [{ required: true, message: '请输入实际余额！' }],
        })(<InputNumber style={{ width: '100%' }} placeholder="请输入实际余额" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('comment', {
          initialValue: balance.comment,
          rules: [{ max: 200, message: '备注过长！' }],
        })(<TextArea placeholder="请输入备注" autosize={{ minRows: 3, maxRows: 6 }} />)}
      </FormItem>
    </Modal>
  );
});

export default UpdateModal;
