import React, { PureComponent } from 'react';
import { Modal, Form, Radio, Input, Select } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@Form.create()
class FinishModal extends PureComponent {
  state = {
    status: 1,
    required: true,
  };

  okHandle = () => {
    const { form, handleFinish, selectedRow } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleFinish({ ...fieldsValue, id: selectedRow.id }, form);
    });
  };

  handleStatusChange = e => {
    let flag = true;
    if (e.target.value !== 1) {
      flag = false;
    }
    this.setState({ required: flag, status: e.target.value });
  };

  render() {
    const { modalVisible, form, handleModalVisible, loading, failedTypes } = this.props;
    const { status, required } = this.state;

    return (
      <Modal
        destroyOnClose
        title="完成"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={loading}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处理状态">
          {form.getFieldDecorator('status', {
            initialValue: status,
            rules: [{ required: true, message: '请选择处理状态！' }],
          })(
            <Radio.Group buttonStyle="solid" onChange={this.handleStatusChange}>
              <Radio.Button value={1}>成功</Radio.Button>
              <Radio.Button value={-1}>失败</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        {status !== 1 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="失败原因">
            {form.getFieldDecorator('failedType', {
              rules: [{ required: true, message: '请选择失败原因！' }],
            })(
              <Select style={{ width: '100%' }} placeholder="请选择失败原因">
                {failedTypes.map(item => (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="反馈信息">
          {form.getFieldDecorator('feedback', {
            rules: [
              { required, whitespace: true, message: '请输入反馈信息！' },
              { max: 200, message: '反馈信息过长！' },
            ],
          })(<TextArea placeholder="请输入反馈信息" autosize={{ minRows: 5, maxRows: 5 }} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default FinishModal;
