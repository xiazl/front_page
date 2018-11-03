import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Input, message, Button, Badge } from 'antd';

const { Search } = Input;

export default class PrivateGroupSetting extends PureComponent {
  state = {
    groupName: '',
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
      title: '专用小组名称',
      dataIndex: 'groupName',
      sorter: (a, b) => {
        if (a.groupName > b.groupName) {
          return -1;
        }
        if (a.groupName < b.groupName) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: '小组状态',
      dataIndex: 'isDelete',
      sorter: (a, b) => a.isDelete - b.isDelete,
      render: text => {
        if (text === 0) {
          return <Badge status="default" text="启用" />;
        }
        return <Badge status="error" text="删除" />;
      },
    },
    {
      title: '卡片数量',
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  fileterData = () => {
    const { keyword } = this.state;
    const { data } = this.props;
    if (!keyword) {
      return data;
    }

    return data.filter(item => `${item.id}`.includes(keyword) || item.groupName.includes(keyword));
  };

  addGroup = () => {
    const { groupName } = this.state;
    if (!groupName) {
      message.error('小组名称不能为空');
      return;
    }

    const { dispatch, getPrivateGroupList } = this.props;
    dispatch({
      type: 'createBilling/addPrivateGroup',
      payload: { groupName },
      callback: response => {
        if (response.success) {
          this.setState({ groupName: '' });
          getPrivateGroupList();
        }
      },
    });
  };

  deleteGroup = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch, getPrivateGroupList } = this.props;

    Modal.confirm({
      title: '确定要删除这些数据？',
      content: '',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'createBilling/deletePrivateGroup',
          payload: selectedRowKeys,
          callback: response => {
            if (response.success) {
              this.setState({ selectedRowKeys: [] });
              getPrivateGroupList();
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
      groupName: '',
      keyword: '',
      selectedRowKeys: [],
    });

    this.props.handleModalVisible();
  };

  render() {
    const { modalVisible } = this.props;
    const { groupName, selectedRowKeys } = this.state;
    const dataSource = this.fileterData();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };

    return (
      <Modal
        destroyOnClose
        width={700}
        title="专用组设置"
        visible={modalVisible}
        onCancel={this.closeModal}
        footer={null}
      >
        <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="请输入组名称"
              enterButton="新增"
              value={groupName}
              onChange={e => this.setState({ groupName: e.target.value })}
              onSearch={this.addGroup}
            />
          </Col>
          {selectedRowKeys.length > 0 && (
            <Col>
              <Button type="danger" onClick={this.deleteGroup}>
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
