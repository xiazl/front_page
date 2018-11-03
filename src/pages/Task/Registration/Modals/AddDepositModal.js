import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const AddDepositModal = Form.create()(props => {
  const { modalVisible, form, handleAddDeposit, handleModalVisible, loading, card = {} } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { cardId, amount, comment } = fieldsValue;
      handleAddDeposit({ cardId, amount, comment }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增入账记录"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="银行卡序号">
        {form.getFieldDecorator('cardId', {
          initialValue: card.cardId,
        })(<Input placeholder="请输入银行序号" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="银行">
        {form.getFieldDecorator('bankName', {
          initialValue: card.bankName,
        })(<Input placeholder="请输入银行名称" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="户名">
        {form.getFieldDecorator('owner', {
          initialValue: card.owner,
        })(<Input placeholder="请输入户名" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="卡号">
        {form.getFieldDecorator('cardNo', {
          initialValue: card.cardNo,
        })(<Input placeholder="请输入卡号" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="入账金额">
        {form.getFieldDecorator('amount', {
          rules: [{ required: true, whitespace: true, message: '请输入入账金额' }],
        })(<Input placeholder="请输入入账金额" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注">
        {form.getFieldDecorator('comment', {
          rules: [{ required: true, whitespace: true, message: '请输入备注' }],
        })(<TextArea placeholder="请输入备注" autosize={{ minRows: 5, maxRows: 5 }} />)}
      </FormItem>
    </Modal>
  );
});

export default AddDepositModal;
