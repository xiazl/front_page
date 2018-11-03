import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const CreateModal = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增小组"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="小组">
        {form.getFieldDecorator('groupName', {
          rules: [{ required: true, whitespace: true, message: '请输入小组名！' }],
        })(<Input placeholder="请输入小组名" />)}
      </FormItem>
    </Modal>
  );
});

export default CreateModal;
