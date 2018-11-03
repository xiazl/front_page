import React from 'react';
import { Modal, Form, Input, Divider } from 'antd';

const FormItem = Form.Item;

const UpdateBatchNameModal = Form.create()(props => {
  const { visible, form, updateBatchName, handleModalVisible, task = {}, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = new FormData();
      formData.append('id', task.id);
      formData.append('batchName', fieldsValue.batchName);
      updateBatchName(formData);
    });
  };

  const formItemProps = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  let typeName = '';
  switch (task.type) {
    case 0:
      typeName = '金额出卡';
      break;
    case 1:
      typeName = '数量出卡';
      break;
    case 2:
      typeName = '卡号出卡';
      break;
    default:
      break;
  }

  const cardAmount = task.cardTaskCount === 0 ? 0 : task.amount / task.cardTaskCount;

  return (
    <Modal
      destroyOnClose
      title="修改批次名称"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <Divider>{typeName}</Divider>
      <FormItem {...formItemProps} label="项目批次名称">
        {form.getFieldDecorator('batchName', {
          initialValue: task.batchName,
          rules: [{ required: true, whitespace: true, message: '请输入项目批次名称！' }],
        })(<Input placeholder="请输入项目批次名称" />)}
      </FormItem>
      {task.type === 0 && (
        <FormItem {...formItemProps} label="项目金额">
          <Input value={task.amount} addonAfter="万" disabled />
        </FormItem>
      )}
      {task.type === 1 ||
        (task.type === 2 && (
          <FormItem {...formItemProps} label="卡片数量">
            <Input value={task.cardTaskCount} addonAfter="张" disabled />
          </FormItem>
        ))}
      <FormItem {...formItemProps} label="单张卡金额">
        <Input value={cardAmount} addonAfter="万" disabled />
      </FormItem>
    </Modal>
  );
});

export default UpdateBatchNameModal;
