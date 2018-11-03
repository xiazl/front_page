import React, { PureComponent, Fragment } from 'react';
import { Modal, Upload, Button, Icon, message as Message } from 'antd';

export default class ImportAmountModal extends PureComponent {
  state = {
    status: 'done',
    data: [],
    success: true,
    message: '',
    importParams: {
      name: 'file',
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      action: '/api/balance/import',
      withCredentials: true,
      beforeUpload: () => {
        this.setState({ data: [], message: '' });
        return true;
      },
      onChange: info => {
        const { file } = info;
        this.setState({ status: file.status });
        if (file.status === 'done') {
          const {
            response: { success, message },
          } = file;
          let {
            response: { data },
          } = file;
          data = data || [];
          if (success && data.length === 0) {
            Message.success(message);
            this.closeModal();
          } else {
            this.setState({ success, message, data });
          }
        }
      },
    },
  };

  closeModal = () => {
    const { handleModalVisible } = this.props;
    this.setState(
      {
        status: 'done',
        data: [],
        success: true,
        message: '',
      },
      () => handleModalVisible(false)
    );
  };

  render() {
    const { visible } = this.props;
    const { importParams, status, success, message, data } = this.state;
    return (
      <Modal
        destroyOnClose
        title="导入实际金额"
        visible={visible}
        onCancel={this.closeModal}
        footer={null}
      >
        <Upload {...importParams}>
          <p>注意：只能导入当日余额</p>
          <Button>
            <Icon type="upload" /> 选择导入文件
          </Button>
        </Upload>
        <div>
          {status === 'uploading' && <p>正在导入，请稍候...</p>}
          {status === 'error' && <p>上传失败，请重试</p>}
          {status === 'done' &&
            data.length > 0 && (
              <Fragment>
                <p>请注意：</p>
                {data.map(item => (
                  <p>{item}</p>
                ))}
              </Fragment>
            )}
          {!success && data.length === 0 && <p style={{ color: 'red' }}>{message}</p>}
        </div>
      </Modal>
    );
  }
}
