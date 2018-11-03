import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const ExamineModal = Form.create()(props => {
  const { modalVisible, form, handleExamine, handleModalVisible, loading, tasks = [] } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleExamine({ ...fieldsValue, dealDepositIds: tasks.map(task => task.id) }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="审核任务"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核状态">
        {form.getFieldDecorator('examine', {
          initialValue: tasks.length === 1 ? tasks[0].examine : null,
          rules: [{ required: true, message: '请选择审核状态！' }],
        })(
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={1}>通过</Radio.Button>
            <Radio.Button value={2}>不通过</Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核备注">
        {form.getFieldDecorator('comment', {
          initialValue: tasks.length === 1 ? tasks[0].examineComment : null,
          rules: [{ max: 200, message: '备注过长！' }],
        })(<TextArea placeholder="请输入备注" autosize={{ minRows: 3, maxRows: 6 }} />)}
      </FormItem>
    </Modal>
  );
});

export default ExamineModal;
