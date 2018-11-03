import React, { PureComponent } from 'react';
import { Drawer, Form, Select, Input, InputNumber, Cascader, Radio, Row, Col, Button } from 'antd';

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
    channel: '0',
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

  handleChannelChange = value => {
    this.setState({ channel: value });
  };

  handleOnCancel = () => {
    const { handleModalVisible, form } = this.props;
    form.resetFields();
    handleModalVisible();
  };

  render() {
    const { modalVisible, form, loading, types, groupNames, channels } = this.props;
    const { billingType, priority, channel } = this.state;

    const formItemProps = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };

    return (
      <Drawer
        maskClosable
        title="创建出账任务"
        width={800}
        visible={modalVisible}
        onClose={this.handleOnCancel}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="分类" {...formItemProps}>
              {form.getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择分类！' }],
              })(
                <Cascader
                  showSearch
                  expandTrigger="hover"
                  fieldNames={{ label: 'value', value: 'key', children: 'items' }}
                  options={types}
                  placeholder="请选选择分类"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="渠道" {...formItemProps}>
              {form.getFieldDecorator('channel', {
                rules: [{ required: true, message: '请选择渠道！' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择渠道"
                  showSearch
                  onChange={this.handleChannelChange}
                >
                  {channels.map(item => (
                    <Option key={item.key}>{item.value}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="任务级别" {...formItemProps}>
              {form.getFieldDecorator('priority', {
                initialValue: priority,
              })(
                <RadioGroup style={{ width: '100%' }} buttonStyle="solid">
                  <RadioButton value={0}>普通</RadioButton>
                  <RadioButton value={1}>优先</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="出账方式" {...formItemProps}>
              {form.getFieldDecorator('billingType', {
                initialValue: billingType,
              })(
                <RadioGroup
                  style={{ width: '100%' }}
                  buttonStyle="solid"
                  onChange={this.handleBillingTypeChange}
                >
                  <RadioButton value={0}>非定卡</RadioButton>
                  <RadioButton value={1}>定卡</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        {billingType === 0 && (
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="单次最低限额" {...formItemProps}>
                {form.getFieldDecorator('minAmountLimit', {
                  validateFirst: true,
                  rules: [{ required: true, message: '请输入单卡单次最低限额！' }],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入单卡单次最低限额" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="小组" {...formItemProps}>
                {form.getFieldDecorator('groups', {
                  rules: [{ required: false, message: '请选择小组！' }],
                })(
                  <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择小组">
                    {groupNames.map(item => (
                      <Option key={item.groupName} value={item.groupName}>
                        {item.groupName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="单次最高限额" {...formItemProps}>
              {form.getFieldDecorator('maxAmountLimit', {
                rules: [{ required: true, message: '请输入单卡单次最高限额！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入单卡单次最高限额" />)}
            </FormItem>
          </Col>
          {billingType === 0 && (
            <Col span={12}>
              <FormItem label="最大次数" {...formItemProps}>
                {form.getFieldDecorator('countLimit', {
                  rules: [{ required: true, message: '请输入单卡最大次数！' }],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入单卡最大次数" />)}
              </FormItem>
            </Col>
          )}
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem {...formItemProps} label="默认金额">
              {form.getFieldDecorator('defaultAmount')(
                <InputNumber style={{ width: '100%' }} placeholder="请输入默认金额" />
              )}
            </FormItem>
          </Col>
          {channel === '1' && (
            <Col span={12}>
              <FormItem label="充值限额" {...formItemProps}>
                {form.getFieldDecorator('alipayLimitAmount', {
                  rules: [{ required: true, message: '请输入支付宝充值限额！' }],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入支付宝充值限额" />)}
              </FormItem>
            </Col>
          )}
        </Row>
        <Form layout="vertical">
          <FormItem label="出账内容">
            {form.getFieldDecorator('comment', {
              rules: [{ required: true, message: '内容不能为空！' }],
            })(
              <TextArea
                placeholder="例支付宝： 代码 编号 子账号 主账号 密码 充值金额 <换行>"
                autosize={{ minRows: 16, maxRows: 20 }}
              />
            )}
          </FormItem>
        </Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={this.handleOnCancel}
          >
            取消
          </Button>
          <Button onClick={this.okHandle} loading={loading} type="primary">
            确定
          </Button>
        </div>
      </Drawer>
    );
  }
}
export default CreateModal;
