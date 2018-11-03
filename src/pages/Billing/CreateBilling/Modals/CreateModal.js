import React, { PureComponent } from 'react';
import { Modal, Form, Select, Input, InputNumber, Cascader, Radio, Row, Col } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@Form.create()
class CreateModal extends PureComponent {
  state = {
    billingType: 0,
    priority: 0,
  };

  okHandle = () => {
    const { form, handleCreate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleCreate(fieldsValue, form);
    });
  };

  handleBillingTypeChange = e => {
    this.setState({ billingType: e.target.value });
  };

  handleOnCancel = () => {
    const { handleModalVisible, form } = this.props;
    form.resetFields();
    handleModalVisible();
  };

  render() {
    const { modalVisible, form, loading, types, groupNames, channels } = this.props;
    const { billingType, priority } = this.state;
    const formItemProps = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        destroyOnClose
        title="创建出账任务"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleOnCancel}
        confirmLoading={loading}
        width={800}
      >
        <Row>
          <Col span={12}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="分类-渠道">
              {form.getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择分类！' }],
              })(
                <Cascader
                  fieldNames={{ label: 'value', value: 'key', children: 'items' }}
                  options={types}
                  placeholder="请选选择分类"
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 16 }} label="">
              {form.getFieldDecorator('channel', {
                rules: [{ required: true, message: '请选择渠道！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择渠道">
                  {channels.map(item => (
                    <Option key={item.key}>{item.value}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem {...formItemProps} label="任务级别">
          {form.getFieldDecorator('priority', {
            initialValue: priority,
          })(
            <RadioGroup style={{ width: '100%' }} onChange={this.handleBillingTypeChange}>
              <RadioButton value={0}>普通</RadioButton>
              <RadioButton value={1}>优先</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemProps} label="出账方式">
          {form.getFieldDecorator('billingType', {
            initialValue: billingType,
          })(
            <RadioGroup style={{ width: '100%' }} onChange={this.handleBillingTypeChange}>
              <RadioButton value={0}>非定卡</RadioButton>
              <RadioButton value={1}>定卡</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        {billingType === 0 && (
          <FormItem {...formItemProps} label="小组">
            {form.getFieldDecorator('groups', {
              rules: [{ required: false, message: '请选择小组！' }],
            })(
              <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择小组">
                {groupNames.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
        {billingType === 0 && (
          <FormItem {...formItemProps} label="单次最低限额">
            {form.getFieldDecorator('minAmountLimit', {
              validateFirst: true,
              rules: [{ required: true, message: '请输入单卡单次最低限额！' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入单卡单次最低限额" />)}
          </FormItem>
        )}
        <FormItem {...formItemProps} label="单次最高限额">
          {form.getFieldDecorator('maxAmountLimit', {
            rules: [{ required: true, message: '请输入单卡单次最高限额！' }],
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入单卡单次最高限额" />)}
        </FormItem>
        {billingType === 0 && (
          <FormItem {...formItemProps} label="最大次数">
            {form.getFieldDecorator('countLimit', {
              rules: [{ required: true, message: '请输入单卡最大次数！' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入单卡最大次数" />)}
          </FormItem>
        )}
        <FormItem {...formItemProps} label="默认金额">
          {form.getFieldDecorator('defaultAmount')(
            <InputNumber style={{ width: '100%' }} placeholder="请输入默认金额" />
          )}
        </FormItem>
        <FormItem {...formItemProps} label="出账内容">
          {form.getFieldDecorator('comment', {
            rules: [{ required: true, message: '内容不能为空！' }],
          })(
            <TextArea
              placeholder="例支付宝： 代码 编号 子账号 主账号 密码 充值金额 <换行>"
              autosize={{ minRows: 16, maxRows: 16 }}
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}
export default CreateModal;
