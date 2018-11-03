import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const AddNewCardModal = Form.create()(props => {
  const { visible, form, addNewCard, handleModalVisible, task = {}, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      addNewCard({ ...fieldsValue, id: task.id });
    });
  };

  const formItemProps = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  return (
    <Modal
      destroyOnClose
      title="新增卡片"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem {...formItemProps} label="项目批次名称">
        <Input value={task.batchName} disabled />
      </FormItem>
      <FormItem {...formItemProps} label="单张卡金额">
        {form.getFieldDecorator('cardAmount', {
          initialValue: '5',
          rules: [
            { required: true, whitespace: true, message: '请输入单张卡金额！' },
            {
              pattern: /^(\d+)((?:\.\d+)?)$/,
              message: '请输入合法金额数字',
            },
          ],
        })(<Input placeholder="请输入单张卡金额" />)}
      </FormItem>
    </Modal>
  );
});

export default AddNewCardModal;
