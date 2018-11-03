import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const EditAmountShouldModal = Form.create()(props => {
  const {
    visible,
    form,
    editAmountShould,
    handleModalVisible,
    rowKeys = [],
    rows = [],
    loading,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      editAmountShould({ ...fieldsValue, ids: rowKeys });
    });
  };

  const formItemProps = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  let initialValue = null;
  if (rows.length === 1) {
    initialValue = rows[0].amountShould;
  }

  return (
    <Modal
      destroyOnClose
      title="编辑应收"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem {...formItemProps} label="应收金额">
        {form.getFieldDecorator('amountShould', {
          initialValue,
          rules: [
            { required: true, whitespace: true, message: '请输入应收金额！' },
            {
              pattern: /^(\d+)((?:\.\d+)?)$/,
              message: '请输入合法金额数字',
            },
          ],
        })(<Input placeholder="请输入应收金额" addonAfter="万" />)}
      </FormItem>
    </Modal>
  );
});

export default EditAmountShouldModal;
