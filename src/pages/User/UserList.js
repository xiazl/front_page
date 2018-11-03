import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Icon,
  Button,
  Select,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateModal from '@/pages/User/Modals/CreateModal';
import UpdateModal from '@/pages/User/Modals/UpdateModal';
import { defaultPagination } from '@/constant';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ users, loading }) => ({
  users,
  loading: loading.models.users,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    selectedRowKeys: [],
    listRole: [],
    selectedRowData: {},
    conditions: {},
    pagination: {
      current: 1,
      pageSize: defaultPagination.pageSize,
    },
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: 'Telegram',
      dataIndex: 'telegramId',
    },
    {
      title: 'Potato',
      dataIndex: 'potatoId',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      render: text => {
        if (text === 1) {
          return <Badge status="error" text="停用" />;
        }
        return <Badge status="success" text="启用" />;
      },
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a onClick={() => this.openUpdateModal(record)}>
            <Icon type="edit" theme="outlined" title="编辑" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.disableUsers(record)}>
            {record.isDisable === 0 ? (
              <Icon type="lock" theme="outlined" title="停用" />
            ) : (
              <Icon type="unlock" theme="outlined" title="启用" />
            )}
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteUsers(record)}>
            <Icon type="delete" theme="outlined" title="删除" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.resetPassword(record)}>
            <Icon type="undo" theme="outlined" title="重置密码" />
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.fetchData();
    this.handleSelect();
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

  // 重置查询条件
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState(
      {
        conditions: {},
      },
      this.fetchData
    );
  };

  // 查询条件展开收缩切换
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 选中行
  handleSelectRows = (rows, rowKeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowKeys,
    });
  };

  // 处理点击查询条件的搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState(
        {
          conditions: fieldsValue,
        },
        () => this.fetchData({ current: 1 })
      );
    });
  };

  // 获取列表数据
  fetchData = (parmas = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'users/fetch',
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
    this.handleSelect();
    this.selectGroups();
  };

  openUpdateModal = record => {
    this.handleUpdateModalVisible(true);
    this.handleSelect();
    this.setState({
      selectedRowData: record,
    });
    this.selectGroups();
  };

  selectGroups = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/listGroup',
    });
  };

  handleSelect = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/listRole',
      callback: response => {
        if (response.success) {
          this.setState({
            listRole: response.data,
          });
        }
      },
    });
  };

  // 新增
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/add',
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
      type: 'users/update',
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

  // 停用
  disableUsers = record => {
    let ids;
    if (record && record.isDisable === 1) {
      this.enableUsers(record);
    } else {
      if (record && record.isDisable === 0) {
        ids = [record.id];
      }
      const { dispatch } = this.props;
      const { selectedRowKeys } = this.state;
      dispatch({
        type: 'users/disable',
        payload: { userIds: ids || selectedRowKeys },
        callback: response => {
          if (response.success) {
            message.success('停用成功');
            this.clearSelectedRows();
            this.fetchData();
          }
        },
      });
    }
  };

  // 启用
  enableUsers = record => {
    let ids;
    if (record && record.isDisable) {
      ids = [record.id];
    }
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'users/enable',
      payload: { userIds: ids || selectedRowKeys },
      callback: response => {
        if (response.success) {
          message.success('启用成功');
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
    let ids;
    if (record && record.id) {
      ids = [record.id];
    }
    Modal.confirm({
      title: '确定要删除？',
      content: '',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'users/delete',
          payload: { userIds: ids || selectedRowKeys },
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

  /** 重置密码 */
  resetPassword = record => {
    const { dispatch } = this.props;
    const { id, nickName } = record;
    Modal.confirm({
      title: `确定要重置用户【${nickName}】的密码？`,
      content: '重置后，初始密码为【123456】，请通知该用户及时修改密码。',
      onOk: () => {
        dispatch({
          type: 'users/resetPassword',
          payload: { id },
          callback: response => {
            if (response.success) {
              message.success('密码重置成功');
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

  // 渲染查询条件表单
  renderConditionForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickName')(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('roleId')(
                <Select style={{ width: '100%' }} allowClear placeholder="请选择角色">
                  {this.state.listRole.map(item => (
                    <Option key={item.id} value={`${item.id}`}>
                      {item.roleName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="状态">
                {getFieldDecorator('isDisable')(
                  <Select style={{ width: '100%' }} allowClear placeholder="请选择状态">
                    <Option value="0">启用</Option>
                    <Option value="1">停用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          ) : (
            <Col md={6} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          )}
        </Row>
        {expandForm && (
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="Telegram">
                {getFieldDecorator('telegramId')(
                  <InputNumber style={{ width: '100%' }} placeholder="请输入Telegram" />
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="Potato">
                {getFieldDecorator('potatoId')(
                  <InputNumber style={{ width: '100%' }} placeholder="请输入Potato" />
                )}
              </FormItem>
            </Col>
          </Row>
        )}
        {expandForm && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </div>
          </div>
        )}
      </Form>
    );
  }

  render() {
    const {
      users: { data, roles, groups },
      loading,
    } = this.props;
    const { selectedRows, createModalVisible, updateModalVisible, selectedRowData } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.openAddModal}>
                新建
              </Button>
              <Button
                icon="lock"
                type="primary"
                disabled={selectedRows.length === 0}
                onClick={this.disableUsers}
              >
                批量停用
              </Button>
              <Button
                icon="unlock"
                type="primary"
                disabled={selectedRows.length === 0}
                onClick={this.enableUsers}
              >
                批量启用
              </Button>
              <Button
                icon="delete"
                type="primary"
                disabled={selectedRows.length === 0}
                onClick={this.deleteUsers}
              >
                批量删除
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
          roles={roles}
          groups={groups}
        />
        <UpdateModal
          modalVisible={updateModalVisible}
          loading={loading}
          handleUpdate={this.handleUpdate}
          handleModalVisible={this.handleUpdateModalVisible}
          selectedRowData={selectedRowData}
          roles={roles}
          groups={groups}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
