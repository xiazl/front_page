import React, { PureComponent } from 'react';
import { Modal, Input, Skeleton } from 'antd';

const { TextArea } = Input;

class CheckDetailsModal extends PureComponent {
  state = {
    data: null,
  };

  componentDidMount() {
    const { dispatch, ids, visible } = this.props;
    if (!visible) return;
    dispatch({
      type: 'createTask/checkBatchDetails',
      payload: { ids },
      callback: response => {
        if (response.success) {
          this.setState({ data: response.data });
        }
      },
    });
  }

  render() {
    const { visible, handleModalVisible, loading } = this.props;
    const { data } = this.state;

    return (
      <Modal
        destroyOnClose
        width={700}
        title="查看任务明细"
        visible={visible}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
        <Skeleton active loading={loading}>
          <TextArea value={data} rows={20} />
        </Skeleton>
      </Modal>
    );
  }
}

export default CheckDetailsModal;
