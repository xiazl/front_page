import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class CreateByCardNoModal extends PureComponent {
  clearData = data => {
    const array = data.split(/[\n,]/g);
    if (!array) {
      return [];
    }

    return array.filter(item => !!item);
  };

  okHandle = () => {
    const { form, createTask } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      createTask({
        ...fieldsValue,
        cardNo: this.clearData(fieldsValue.cardNo),
        outCardType: 2,
      });
    });
  };

  handleOnCancel = () => {
    const { handleModalVisible, form } = this.props;
    form.resetFields();
    handleModalVisible();
  };

  autoTransformWhenProjectOnBlur = e => {
    const { form } = this.props;
    const value = e.target.value;
    if (!value) return;
    const fieldsValue = { project: value.toUpperCase() };

    form.setFieldsValue(fieldsValue);
  };

  render() {
    const { visible, form, loading } = this.props;

    const formItemProps = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        destroyOnClose
        title="卡号出卡"
        visible={visible}
        onOk={this.okHandle}
        onCancel={this.handleOnCancel}
        confirmLoading={loading}
      >
        <FormItem {...formItemProps} label="项目批次名称">
          {form.getFieldDecorator('project', {
            rules: [{ required: true, whitespace: true, message: '请输项目批次名称！' }],
          })(
            <Input placeholder="请输入项目批次名称" onBlur={this.autoTransformWhenProjectOnBlur} />
          )}
        </FormItem>
        <FormItem {...formItemProps} label="单张卡金额">
          {form.getFieldDecorator('cardAmount', {
            validateFirst: true,
            rules: [
              { required: true, whitespace: true, message: '请输入单张卡金额！' },
              {
                pattern: /^(\d+)((?:\.\d+)?)$/,
                message: '请输入合法金额数字',
              },
            ],
          })(<Input placeholder="请输入单张卡金额" addonAfter="万" />)}
        </FormItem>
        <FormItem {...formItemProps} label="卡号">
          {form.getFieldDecorator('cardNo', {
            rules: [{ required: true, whitespace: true, message: '请输入卡号！' }],
          })(
            <TextArea
              placeholder="卡号之间换行或者用逗号隔开"
              autosize={{ minRows: 5, maxRows: 8 }}
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default CreateByCardNoModal;
