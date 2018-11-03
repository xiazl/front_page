import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { authority } from '@/constant';
import { checkAuthority } from '@/utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;

const UpdateModal = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading } = props;
  const balance = props.selectRows || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { id, cardId, amount, comment, createTimeStr } = fieldsValue;
      handleUpdate({ id, cardId, amount, comment, createTimeStr }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改出账"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="序号">
        {form.getFieldDecorator('id', {
          initialValue: `${balance.id}`,
          rules: [{ required: true, whitespace: true, message: '请输入序号！' }],
        })(<Input placeholder="请输入卡号" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="银行卡序号">
        {form.getFieldDecorator('cardId', {
          initialValue: `${balance.cardId}`,
          rules: [{ required: true, whitespace: true, message: '请输入银行卡序号！' }],
        })(<Input placeholder="请输入银行卡序号" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="银行">
        {form.getFieldDecorator('bankName', {
          initialValue: `${balance.bankName}`,
          rules: [{ required: true, whitespace: true, message: '请输入银行！' }],
        })(<Input placeholder="请输入银行" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="户名">
        {form.getFieldDecorator('owner', {
          initialValue: `${balance.owner}`,
          rules: [{ required: true, whitespace: true, message: '请输入户名！' }],
        })(<Input placeholder="请输入户名" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卡号">
        {form.getFieldDecorator('cardNo', {
          initialValue: balance.cardNo,
          rules: [{ required: true, whitespace: true, message: '请输入用卡号！' }],
        })(<Input placeholder="请输入用卡号" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组员">
        {form.getFieldDecorator('operatorNickName', {
          initialValue: balance.operatorNickName,
          rules: [{ required: true, whitespace: true, message: '请输入组员昵称！' }],
        })(<Input placeholder="请输入组员昵称" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="入账登记时间">
        {form.getFieldDecorator('createTimeStr', {
          initialValue: `${balance.createTimeStr}`,
          rules: [{ required: true, whitespace: true, message: '请输入入账登记时间！' }],
        })(<Input placeholder="请输入入账登记时间" disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="入账金额(万)">
        {form.getFieldDecorator('amount', {
          initialValue: `${balance.amount}`,
          rules: [{ required: true, message: '请输入入账金额！' }],
        })(
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入入账金额"
            disabled={checkAuthority(authority.operator)}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('comment', {
          initialValue: `${balance.comment}`,
          rules: [
            { required: true, whitespace: true, message: '请输入备注！' },
            { max: 200, message: '备注过长！' },
          ],
        })(<TextArea placeholder="请输入备注" autosize={{ minRows: 3, maxRows: 6 }} />)}
      </FormItem>
    </Modal>
  );
});

export default UpdateModal;
