import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const UpdateModal = Form.create()(props => {
  const { modalVisible, form, handleDisable, handleModalVisible, loading, cards = [] } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleDisable({ ...fieldsValue, ids: cards.map(card => card.id) }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="停用卡片"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <div>
        <p>是否要停用如下卡片:</p>
        {cards.map(card => (
          <p key={card.id}>
            {`${card.cardNo} ${card.owner} ${card.province} ${card.city} ${card.branchName}`}
          </p>
        ))}
      </div>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="停用原因">
        {form.getFieldDecorator('reason', {
          rules: [{ max: 200, message: '原因过长！' }],
        })(<TextArea placeholder="请输入原因" autosize={{ minRows: 3, maxRows: 6 }} />)}
      </FormItem>
    </Modal>
  );
});

export default UpdateModal;
