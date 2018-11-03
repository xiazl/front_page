import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const AuditModal = Form.create()(props => {
  const { modalVisible, form, handleAudit, handleModalVisible, loading } = props;
  const billing = props.selectRows || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAudit({ ...fieldsValue, ids: billing.map(task => task.id) }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="审计"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核状态">
        {form.getFieldDecorator('status', {
          initialValue: billing.length === 1 ? billing[0].auditStatus : null,
          rules: [{ required: true, message: '请选择审核状态！' }],
        })(
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={0}>审计中</Radio.Button>
            <Radio.Button value={1}>通过</Radio.Button>
            <Radio.Button value={-1}>不通过</Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核备注">
        {form.getFieldDecorator('comment', {
          initialValue: billing.length === 1 ? billing[0].auditComment : null,
          rules: [
            { required: false, whitespace: true, message: '请输入备注！' },
            { max: 200, message: '备注过长！' },
          ],
        })(<TextArea placeholder="请输入备注" autosize={{ minRows: 3, maxRows: 6 }} />)}
      </FormItem>
    </Modal>
  );
});
export default AuditModal;
