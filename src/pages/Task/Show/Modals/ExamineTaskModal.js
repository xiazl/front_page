import React, { PureComponent } from 'react';
import { Modal, Tabs, Button, message, Divider } from 'antd';
import TableWrapper from '@/components/TableWrapper';

const TabPane = Tabs.TabPane;

export default class ExamineTaskModal extends PureComponent {
  state = {
    activeKey: '1',
    notMatchedData: [],
    matchedData: [],
    notMatchedSelectedRowKeys: [],
    notMatchedSelectedRows: [],
    matchedSelectedRows: [],
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '开户行',
      dataIndex: 'bankName',
      sorter: (a, b) => {
        if (a.bankName > b.bankName) {
          return 1;
        }
        if (a.bankName < b.bankName) {
          return -1;
        }
        return 0;
      },
    },
    {
      title: '操作员',
      dataIndex: 'operatorNickName',
      sorter: (a, b) => {
        if (a.operatorNickName > b.operatorNickName) {
          return 1;
        }
        if (a.operatorNickName < b.operatorNickName) {
          return -1;
        }
        return 0;
      },
    },
    {
      title: '入账金额',
      dataIndex: 'depositAmount',
      sorter: (a, b) => a.depositAmount - b.depositAmount,
    },
    {
      title: '记录时间',
      dataIndex: 'createTime',
      sorter: (a, b) => {
        if (a.createTime > b.createTime) {
          return 1;
        }
        if (a.createTime < b.createTime) {
          return -1;
        }
        return 0;
      },
    },
    {
      title: '备注',
      dataIndex: 'comment',
    },
  ];

  componentDidMount() {
    const { visible } = this.props;
    if (visible) {
      this.fetchData();
    }
  }

  onCancel = () => {
    this.props.clearSelectedRows();
    this.props.onCancel();
  };

  changeTab = activeKey => this.setState({ activeKey });

  onNotMatchedSelectRow = (selectedRows, selectedRowKeys) =>
    this.setState({
      notMatchedSelectedRows: selectedRows,
      notMatchedSelectedRowKeys: selectedRowKeys,
    });

  onMatchedSelectRow = selectedRows =>
    this.setState({
      matchedSelectedRows: selectedRows,
    });

  clearNotMatchedSelected = () =>
    this.setState({ notMatchedSelectedRowKeys: [], notMatchedSelectedRows: [] });

  clearMatchedSelected = () => this.setState({ matchedSelectedRows: [] });

  fetchData = () => {
    const {
      dispatch,
      task: { id, cardNo },
    } = this.props;
    dispatch({
      type: 'showTask/queryMatchedRecord',
      payload: { id },
      callback: response => {
        if (response.success) {
          this.setState({ matchedData: response.data });
        }
      },
    });

    dispatch({
      type: 'showTask/queryNotMatchedRecord',
      payload: { cardNo },
      callback: response => {
        if (response.success) {
          this.setState({ notMatchedData: response.data });
        }
      },
    });
  };

  /** 绑定 */
  bundling = () => {
    const { notMatchedSelectedRows } = this.state;
    const {
      refreshShowTaskList,
      dispatch,
      task: { id },
    } = this.props;
    const recordIds = [];
    const recordAmounts = [];
    notMatchedSelectedRows.forEach(item => {
      recordIds.push(item.id);
      recordAmounts.push(item.depositAmount);
    });
    dispatch({
      type: 'showTask/bundling',
      payload: { taskId: id, recordIds, recordAmounts },
      callback: response => {
        if (response.success) {
          message.success(response.message);
          this.clearNotMatchedSelected();
          this.fetchData();
          refreshShowTaskList();
        }
      },
    });
  };

  /** 解除绑定 */
  removeBundling = () => {
    const { matchedSelectedRows } = this.state;
    const {
      refreshShowTaskList,
      dispatch,
      task: { id },
    } = this.props;
    const recordIds = [];
    const recordAmounts = [];
    matchedSelectedRows.forEach(item => {
      recordIds.push(item.id);
      recordAmounts.push(item.depositAmount);
    });
    dispatch({
      type: 'showTask/removeBundling',
      payload: { taskId: id, recordIds, recordAmounts },
      callback: response => {
        if (response.success) {
          message.success(response.message);
          this.clearMatchedSelected();
          this.fetchData();
          refreshShowTaskList();
        }
      },
    });
  };

  /** 转额外收入 */
  setExtraDeposit = () => {
    const { notMatchedSelectedRowKeys } = this.state;
    const { dispatch, refreshShowTaskList } = this.props;

    Modal.confirm({
      title: '是否确定要转为额外收入？',
      onOk: () => {
        dispatch({
          type: 'showTask/setExtraDeposit',
          payload: { ids: notMatchedSelectedRowKeys },
          callback: response => {
            if (response.success) {
              message.success('转为额外收入成功');
              this.clearNotMatchedSelected();
              this.fetchData();
              refreshShowTaskList();
            }
          },
        });
      },
    });
  };

  render() {
    const {
      visible,
      queryMatchedRecordLoading,
      queryNotMatchedRecordLoading,
      bundlingLoading,
      removeBundlingLoading,
      setExtraDepositLoading,
    } = this.props;
    const {
      activeKey,
      notMatchedData,
      matchedData,
      notMatchedSelectedRows,
      matchedSelectedRows,
    } = this.state;

    const footer = [
      <Button key="cancel" onClick={this.onCancel}>
        取消
      </Button>,
      <Divider key="divider-1" type="vertical" />,
    ];

    if (activeKey === '1') {
      footer.push(
        <Button
          key="setExtraDeposit"
          type="danger"
          disabled={notMatchedSelectedRows.length === 0}
          onClick={this.setExtraDeposit}
          loading={setExtraDepositLoading}
        >
          转额外收入
        </Button>,
        <Divider key="divider-2" type="vertical" />,
        <Button
          key="bundling"
          type="primary"
          disabled={notMatchedSelectedRows.length === 0}
          onClick={this.bundling}
          loading={bundlingLoading}
        >
          绑定
        </Button>
      );
    } else {
      footer.push(
        <Button
          key="relieveBinding"
          type="primary"
          disabled={matchedSelectedRows.length === 0}
          onClick={this.removeBundling}
          loading={removeBundlingLoading}
        >
          解除绑定
        </Button>
      );
    }

    return (
      <Modal
        destroyOnClose
        width={700}
        title="审计任务"
        visible={visible}
        onCancel={this.onCancel}
        footer={footer}
      >
        <Tabs type="card" onChange={this.changeTab}>
          <TabPane tab="未匹配任务" key="1">
            <TableWrapper
              loading={queryNotMatchedRecordLoading}
              columns={this.columns}
              dataSource={notMatchedData}
              selectedRows={notMatchedSelectedRows}
              onSelectRow={this.onNotMatchedSelectRow}
            />
          </TabPane>
          <TabPane tab="已匹配任务" key="2">
            <TableWrapper
              loading={queryMatchedRecordLoading}
              columns={this.columns}
              dataSource={matchedData}
              selectedRows={matchedSelectedRows}
              onSelectRow={this.onMatchedSelectRow}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
