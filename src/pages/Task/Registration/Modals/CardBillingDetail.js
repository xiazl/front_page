import React, { PureComponent } from 'react';
import { Modal, Table, Row, Col, Input } from 'antd';

const { Search } = Input;

export default class CardBillingDetail extends PureComponent {
  state = {
    keyword: '',
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '出账时间',
      dataIndex: 'createTimeStr',
    },
    {
      title: '出账金额',
      dataIndex: 'amount',
    },
    {
      title: '出账备注',
      dataIndex: 'comment',
    },
    {
      title: '出账类型',
      dataIndex: 'typeStr',
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
        item.createTimeStr.includes(keyword) ||
        `${item.amount}`.includes(keyword) ||
        item.comment.includes(keyword) ||
        item.typeStr.includes(keyword)
    );
  };

  closeModal = () => {
    this.setState({
      keyword: '',
    });

    this.props.handleModalVisible();
  };

  render() {
    const { modalVisible } = this.props;
    const dataSource = this.fileterData();

    return (
      <Modal
        destroyOnClose
        width={700}
        title="出账明细"
        visible={modalVisible}
        onCancel={this.closeModal}
        footer={null}
      >
        <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
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
