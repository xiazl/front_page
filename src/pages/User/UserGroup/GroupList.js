import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Card, Form, Icon, Button, message, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateModal from '@/pages//User/UserGroup/Modals/CreateModal';
import UpdateModal from '@/pages/User/UserGroup/Modals/UpdateModal';
import { defaultPagination } from '@/constant';

import styles from '@/pages/TableLayout.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ group, loading }) => ({
  group,
  loading: loading.models.group,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    selectedRowKeys: [],
    selectedRowData: {},
    conditions: {},
    pagination: {
      current: 1,
      pageSize: defaultPagination.pageSize,
    },
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '小组',
      dataIndex: 'groupName',
    },
    {
      title: '创建人',
      dataIndex: 'nickName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a onClick={() => this.openUpdateModal(record)}>
            <Icon type="edit" theme="outlined" title="编辑" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteUsers(record)}>
            <Icon type="delete" theme="outlined" title="删除" />
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.fetchData();
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.orderBy = sorter.field;
      params.orderType = sorter.order.slice(0, -3);
    }

    this.setState({ pagination: params }, this.fetchData);
  };

  // 选中行
  handleSelectRows = (rows, rowKeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowKeys,
    });
  };

  // 获取列表数据
  fetchData = (parmas = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'group/fetch',
      payload: {
        ...conditions,
        ...pagination,
        ...parmas,
      },
      callback: response => {
        if (response.success) {
          this.setState({
            pagination: {
              ...pagination,
              ...response.data.pagination,
            },
          });
        }
      },
    });
  };

  // 控制新增弹框可见性
  handleCreateModalVisible = flag => this.setState({ createModalVisible: !!flag });

  // 控制编辑弹框可见性
  handleUpdateModalVisible = flag => this.setState({ updateModalVisible: !!flag });

  openAddModal = () => {
    this.handleCreateModalVisible(true);
  };

  openUpdateModal = record => {
    this.handleUpdateModalVisible(true);
    this.setState({
      selectedRowData: record,
    });
  };

  // 新增
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/add',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('新建成功');
          this.handleCreateModalVisible();
          this.fetchData();
        }
      },
    });
  };

  // 编辑
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/update',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('编辑成功');
          this.handleUpdateModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  // 删除
  deleteUsers = record => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    Modal.confirm({
      title: '确定要删除？',
      content: '',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'group/delete',
          payload: { id: record.id || selectedRowKeys },
          callback: response => {
            if (response.success) {
              message.success('删除成功');
              this.clearSelectedRows();
              this.fetchData();
            }
          },
        });
      },
    });
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
    this.setState({ selectedRowKeys: [] });
  };

  render() {
    const {
      group: { data },
      loading,
    } = this.props;
    const { selectedRows, createModalVisible, updateModalVisible, selectedRowData } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.openAddModal}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowSelectDisabled="true"
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateModal
          modalVisible={createModalVisible}
          loading={loading}
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleCreateModalVisible}
        />
        <UpdateModal
          modalVisible={updateModalVisible}
          loading={loading}
          handleUpdate={this.handleUpdate}
          handleModalVisible={this.handleUpdateModalVisible}
          selectedRowData={selectedRowData}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
