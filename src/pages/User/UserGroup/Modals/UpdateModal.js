import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const UpdateModal = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading } = props;
  const group = props.selectedRowData || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { groupName } = fieldsValue;
      handleUpdate({ id: group.id, groupName }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改小组"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="小组">
        {form.getFieldDecorator('groupName', {
          initialValue: group.groupName,
          rules: [{ required: true, whitespace: true, message: '请输入小组名！' }],
        })(<Input placeholder="请输入小组名" />)}
      </FormItem>
    </Modal>
  );
});

export default UpdateModal;
