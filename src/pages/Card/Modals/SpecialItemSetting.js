import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Input, message, Button } from 'antd';

const { Search } = Input;

export default class SpecialItemSetting extends PureComponent {
  state = {
    projectName: '',
    keyword: '',
    selectedRowKeys: [],
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '专用项目名称',
      dataIndex: 'projectName',
      sorter: (a, b) => {
        if (a.projectName > b.projectName) {
          return -1;
        }
        if (a.projectName < b.projectName) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: '包含卡片数量',
      dataIndex: 'cardCount',
      sorter: (a, b) => a.cardCount - b.cardCount,
    },
  ];

  fileterData = () => {
    const { keyword } = this.state;
    const { data } = this.props;
    if (!keyword) {
      return data;
    }

    return data.filter(
      item =>
        `${item.id}`.includes(keyword) ||
        item.projectName.includes(keyword) ||
        `${item.cardCount}`.includes(keyword)
    );
  };

  addProject = () => {
    const { projectName } = this.state;
    if (!projectName) {
      message.error('项目名称不能为空');
      return;
    }

    const { dispatch, getProjectList } = this.props;
    dispatch({
      type: 'card/addProject',
      payload: { projectName },
      callback: response => {
        if (response.success) {
          this.setState({ projectName: '' });
          getProjectList();
        }
      },
    });
  };

  deleteProject = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch, getProjectList } = this.props;

    Modal.confirm({
      title: '确定要删除这些数据？',
      content: '',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'card/deleteProject',
          payload: selectedRowKeys,
          callback: response => {
            if (response.success) {
              this.setState({ selectedRowKeys: [] });
              getProjectList();
            }
          },
        });
      },
    });
  };

  selectRow = record => {
    const { selectedRowKeys: preSelectedRowKeys } = this.state;
    const selectedRowKeys = [...preSelectedRowKeys];
    const index = selectedRowKeys.indexOf(record.id);
    if (index >= 0) {
      selectedRowKeys.splice(index, 1);
    } else {
      selectedRowKeys.push(record.id);
    }
    this.setState({ selectedRowKeys });
  };

  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  closeModal = () => {
    this.setState({
      projectName: '',
      keyword: '',
      selectedRowKeys: [],
    });

    this.props.handleModalVisible();
  };

  render() {
    const { modalVisible } = this.props;
    const { projectName, selectedRowKeys } = this.state;
    const dataSource = this.fileterData();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };

    return (
      <Modal
        destroyOnClose
        width={700}
        title="专用项目设置"
        visible={modalVisible}
        onCancel={this.closeModal}
        footer={null}
      >
        <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="请输入项目名称"
              enterButton="新增"
              value={projectName}
              onChange={e => this.setState({ projectName: e.target.value })}
              onSearch={this.addProject}
            />
          </Col>
          {selectedRowKeys.length > 0 && (
            <Col>
              <Button type="danger" onClick={this.deleteProject}>
                删除
              </Button>
            </Col>
          )}
          <Col span={8}>
            <Search
              onSearch={value => this.setState({ keyword: value })}
              onChange={e => this.setState({ keyword: e.target.value })}
            />
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={dataSource}
          onChange={this.onChange}
          rowSelection={rowSelection}
          onRow={record => ({
            onClick: () => this.selectRow(record),
          })}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `第${range[0]}-${range[1]}条记录，共${total}条`,
          }}
        />
      </Modal>
    );
  }
}
