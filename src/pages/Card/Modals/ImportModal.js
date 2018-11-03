import React, { PureComponent, Fragment } from 'react';
import { Modal, Upload, Button, Icon, message as Message } from 'antd';

export default class ImportModal extends PureComponent {
  state = {
    status: 'done',
    data: [],
    success: true,
    message: '',
    importParams: {
      name: 'file',
      accept: 'application/vnd.ms-excel',
      action: '/api/card/import',
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
            Message.success('导入成功');
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
    const { modalVisible } = this.props;
    const { importParams, status, success, message, data } = this.state;
    return (
      <Modal
        destroyOnClose
        title="导入卡片"
        visible={modalVisible}
        onCancel={this.closeModal}
        footer={null}
      >
        <Upload {...importParams}>
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
          {!success && data.length === 0 && <p>{message}</p>}
        </div>
      </Modal>
    );
  }
}
