import React from 'react';
import { Modal, Form } from 'antd';

const DeleteModal = Form.create()(props => {
  const { modalVisible, form, handleDelete, handleModalVisible, loading, cards = [] } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleDelete({ ...fieldsValue, ids: cards.map(card => card.id) }, form);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="是否要删除如下卡片"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <div>
        {cards.map(card => (
          <p>{`${card.cardNo} ${card.owner} ${card.province} ${card.city} ${card.branchName}`}</p>
        ))}
      </div>
    </Modal>
  );
});

export default DeleteModal;
