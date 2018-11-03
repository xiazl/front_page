import React, { PureComponent } from 'react';
import { Modal, Form, Input, Checkbox, Select } from 'antd';
import SelectAll from '@/components/SelectAll';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class CreateByMoneyModal extends PureComponent {
  state = {
    outCardType: ['1'],
    cardCount: '5',
    projectName: '',
    gNames: [],
    bankNames: [],
  };

  handleOutCardTypeChange = outCardType => {
    this.setState({ outCardType });
  };

  okHandle = () => {
    const { form, createTask } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { projectName, gNames = [], bankNames = [] } = fieldsValue;
      this.setState({ projectName, gNames, bankNames });
      createTask({ ...fieldsValue, outCardType: 0 }, form);
    });
  };

  handleOnCancel = () => {
    const { handleModalVisible, form } = this.props;
    form.resetFields();
    // this.setState({ outCardType: ['1'] });
    handleModalVisible();
  };

  autoTransformWhenProjectOnBlur = e => {
    const { form } = this.props;
    const value = e.target.value;
    if (!value) return;
    const fieldsValue = { project: value.toUpperCase() };
    const index = value.indexOf('-');
    if (index >= 0) {
      const projectAmount = value.substr(index + 1).replace(/[^0-9.]/gi, '');
      if (projectAmount) {
        fieldsValue.projectAmount = projectAmount;
      }
    }

    form.setFieldsValue(fieldsValue);
  };

  render() {
    const { visible, form, loading, groupNames, projectNames, bankNames } = this.props;
    const { outCardType, cardCount, projectName, gNames, bankNames: bNames } = this.state;

    const formItemProps = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        destroyOnClose
        title="金额出卡"
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
        <FormItem {...formItemProps} label="项目金额">
          {form.getFieldDecorator('projectAmount', {
            rules: [
              { required: true, whitespace: true, message: '请输入项目金额！' },
              {
                pattern: /^(\d+)((?:\.\d+)?)$/,
                message: '请输入合法金额数字',
              },
            ],
          })(<Input placeholder="请输入项目金额" addonAfter="万" />)}
        </FormItem>
        <FormItem {...formItemProps} label="单张卡金额">
          {form.getFieldDecorator('cardAmount', {
            validateFirst: true,
            initialValue: cardCount,
            rules: [
              { required: true, whitespace: true, message: '请输入单张卡金额！' },
              {
                pattern: /^(\d+)((?:\.\d+)?)$/,
                message: '请输入合法金额数字',
              },
            ],
          })(<Input placeholder="请输入单张卡金额" addonAfter="万" />)}
        </FormItem>
        <FormItem {...formItemProps} label="出卡方式">
          <Checkbox.Group
            defaultValue={outCardType}
            style={{ width: '100%' }}
            onChange={this.handleOutCardTypeChange}
          >
            <Checkbox value="1" disabled>
              项目
            </Checkbox>
            <Checkbox value="2">小组</Checkbox>
            <Checkbox value="3">银行</Checkbox>
          </Checkbox.Group>
        </FormItem>
        <FormItem {...formItemProps} label="选择项目">
          {form.getFieldDecorator('projectName', {
            initialValue: projectName,
            rules: [{ required: true, whitespace: true, message: '请选择项目！' }],
          })(
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder="请选择项目"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {projectNames.map(item => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        {outCardType.includes('2') && (
          <FormItem {...formItemProps} label="选择小组">
            {form.getFieldDecorator('gNames', {
              initialValue: gNames,
              rules: [{ required: true, message: '请选择小组！' }],
            })(
              <SelectAll mode="multiple" placeholder="请选择小组" style={{ width: '100%' }}>
                {groupNames.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </SelectAll>
            )}
          </FormItem>
        )}
        {outCardType.includes('3') && (
          <FormItem {...formItemProps} label="选择银行">
            {form.getFieldDecorator('bankNames', {
              initialValue: bNames,
              rules: [{ required: true, message: '请选择银行！' }],
            })(
              <SelectAll mode="multiple" placeholder="请选择银行" style={{ width: '100%' }}>
                {bankNames.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </SelectAll>
            )}
          </FormItem>
        )}
      </Modal>
    );
  }
}

export default CreateByMoneyModal;
