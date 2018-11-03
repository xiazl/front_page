import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const UpdateReasonModal = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading } = props;
  const billing = props.selectRows || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate({ ...fieldsValue, ids: billing.map(card => card.id) }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改停用原因"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="停用原因">
        {form.getFieldDecorator('reason', {
          initialValue: billing.length === 1 ? billing[0].disableReason : null,
          rules: [
            { required: true, whitespace: true, message: '请输入停用原因！' },
            { max: 200, message: '停用原因过长！' },
          ],
        })(<TextArea placeholder="请输入停用原因" autosize={{ minRows: 3, maxRows: 6 }} />)}
      </FormItem>
    </Modal>
  );
});

export default UpdateReasonModal;
