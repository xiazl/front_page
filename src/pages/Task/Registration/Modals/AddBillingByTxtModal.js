import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const AddBillingByTxtModal = Form.create()(props => {
  const { modalVisible, form, handleAddBillingByTxt, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAddBillingByTxt({ ...fieldsValue }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="文本出账"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
      width={750}
    >
      <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} label="">
        {form.getFieldDecorator('txtContent')(
          <TextArea
            placeholder="可输入多行文本信息,单行示例:借款 955801234567890 5.1 入账备注信息<换行>"
            autosize={{ minRows: 16, maxRows: 16 }}
          />
        )}
      </FormItem>
    </Modal>
  );
});

export default AddBillingByTxtModal;
