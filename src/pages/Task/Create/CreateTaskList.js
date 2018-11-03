import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  message,
  DatePicker,
  Badge,
  Tag,
  Modal,
  Select,
} from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import Authorized from '@/utils/Authorized';
import CreateByMoneyModal from './Modals/CreateByMoneyModal';
import CreateByQtyModal from './Modals/CreateByQtyModal';
import CreateByCardNoModal from './Modals/CreateByCardNoModal';
import UpdateBatchNameModal from './Modals/UpdateBatchNameModal';
import AddNewCardModal from './Modals/AddNewCardModal';
import CheckDetailsModal from './Modals/CheckDetailsModal';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ createTask, loading }) => ({
  createTask,
  loading: loading.models.createTask,
  saveTaskLoading: loading.effects['createTask/saveTask'],
  updateBatchNameLoading: loading.effects['createTask/updateBatchName'],
  addNewCardLoading: loading.effects['createTask/addNewCard'],
  checkDetailsLoading: loading.effects['createTask/checkBatchDetails'],
}))
@Form.create()
class createTaskList extends PureComponent {
  state = {
    curDay: moment().valueOf(),
    expandForm: false,
    createByMoneyModalVisible: false,
    createByQtyModalVisible: false,
    createByCardNoModalVisible: false,
    updateBatchNameModalVisible: false,
    addNewCardModalVisible: false,
    checkDetailsModalVisible: false,
    checkDetailsModalKey: 1,
    selectedRows: [],
    selectedRowKeys: [],
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
      sorter: true,
    },
    {
      title: '项目',
      dataIndex: 'projectName',
    },
    {
      title: '批次',
      dataIndex: 'batchName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: text => {
        switch (text) {
          case 0:
            return '金额出卡';
          case 1:
            return '数量出卡';
          case 2:
            return '卡号出卡';
          default:
            return text;
        }
      },
    },
    {
      title: '出卡人',
      dataIndex: 'nickName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTimeStr',
    },
    {
      title: '预收',
      dataIndex: 'amount',
    },
    {
      title: '应收',
      dataIndex: 'amountShould',
    },
    {
      title: '已审计',
      dataIndex: 'amountBind',
    },
    {
      title: '任务数',
      dataIndex: 'cardTaskCount',
    },
    {
      title: '已完成',
      dataIndex: 'complate',
    },
    {
      title: '未完成',
      dataIndex: 'notComplate',
    },
    {
      title: '状态',
      dataIndex: 'notComplate',
      key: 'notComplate-1',
      render: text => {
        if (text > 0) {
          return <Badge status="warning" text="未完成" />;
        }
        return <Badge status="success" text="已完成" />;
      },
    },
    {
      title: '归档',
      dataIndex: 'isArchive',
      render: text => {
        if (text === '未归档') {
          return <Tag color="red">{text}</Tag>;
        }
        return <Tag color="green">{text}</Tag>;
      },
    },
  ];

  componentDidMount() {
    this.fetchCurDay();
  }

  // 从后台获取当天业务日期
  fetchCurDay = () => {
    const { conditions } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'global/fetchCurDay',
      callback: response => {
        let curDay = moment().valueOf();
        if (response.success) {
          curDay = response.data;
        }

        const curDate = moment(curDay).format('YYYY-MM-DD');
        this.setState(
          {
            curDay,
            conditions: { ...conditions, startTime: curDate, stopTime: curDate },
          },
          this.fetchData
        );
      },
    });
  };

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
    // 重置时将时间控件的默认值写入state
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // 将dateRange对象处理为开始结束时间
      const { dateRange, ...rest } = fieldsValue;
      const startTime = dateRange[0].format('YYYY-MM-DD');
      const stopTime = dateRange[1].format('YYYY-MM-DD');

      this.setState(
        {
          conditions: { ...rest, startTime, stopTime },
        },
        () => this.fetchData({ current: 1 })
      );
    });
  };

  // 查询条件展开收缩切换
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 选中行
  handleSelectRows = (rows, rewKeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rewKeys,
    });
  };

  // 处理点击查询条件的搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // 将dateRange对象处理为开始结束时间
      const { dateRange, ...rest } = fieldsValue;
      const startTime = dateRange[0].format('YYYY-MM-DD');
      const stopTime = dateRange[1].format('YYYY-MM-DD');

      this.setState(
        {
          conditions: { ...rest, startTime, stopTime },
        },
        () => this.fetchData({ current: 1 })
      );
    });
  };

  // 获取列表数据
  fetchData = (params = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'createTask/fetch',
      payload: {
        ...conditions,
        ...pagination,
        ...params,
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

  // 导出列表
  exportExcelTable = () => {
    const { conditions } = this.state;
    window.open(`/api/statistical/exportTaskTable?${stringify(conditions)}`, '_blank');
  };

  // 导出明细
  exportExcelOne = () => {
    const { selectedRows, selectedRowKeys } = this.state;
    const conditions = {
      ids: selectedRowKeys,
      createTime: selectedRows[0].createTimeStr,
      amount: selectedRows[0].amount,
      fileName: selectedRows[0].batchName,
    };

    window.open(
      `/api/statistical/exportMultiBatchDetailExcelByTaskIds?${stringify(conditions)}`,
      '_blank'
    );
  };

  // 导出明细文本
  exportTxt = () => {
    const { selectedRowKeys } = this.state;
    window.open(`/api/task/exportTxt?ids=${selectedRowKeys}`, '_blank');
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [], selectedRowKeys: [] });
  };

  /** 创建出卡任务 */
  createTask = task => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createTask/saveTask',
      payload: task,
      callback: response => {
        if (response.success) {
          message.success('任务创建成功');
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  /** 修改项目批次名称 */
  updateBatchName = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createTask/updateBatchName',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('修改批次名成功');
          this.handleUpdateBatchNameModalVisible(false);
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  /** 删除任务 */
  deleteTask = () => {
    const {
      selectedRows: [{ isArchive }],
    } = this.state;
    if (isArchive === '已归档') {
      message.error('数据已归档，无法删除');
      return;
    }
    Modal.confirm({
      title: '是否确定要删除？',
      content: '',
      onOk: () => {
        const { selectedRowKeys } = this.state;
        this.props.dispatch({
          type: 'createTask/deleteProjectTask',
          payload: selectedRowKeys,
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

  /** 新增卡片 */
  addNewCard = params =>
    this.props.dispatch({
      type: 'createTask/addNewCard',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('新增卡片成功');
          this.handleAddNewCardModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });

  /** 打开新增卡片弹框 */
  openAddNewCardModal = () => {
    const {
      selectedRows: [{ isArchive }],
    } = this.state;
    if (isArchive === '已归档') {
      message.error('数据已归档，无法新增卡片');
      return;
    }
    this.handleAddNewCardModalVisible(true);
  };

  // 控制金额出卡弹框是否显示
  handleCreatByMoneyVisible = flag => this.setState({ createByMoneyModalVisible: !!flag });

  // 控制数量出卡弹框是否显示
  handleCreatByQtyVisible = flag => this.setState({ createByQtyModalVisible: !!flag });

  // 控制卡号出卡弹框是否显示
  handleCreatByCardNoVisible = flag => this.setState({ createByCardNoModalVisible: !!flag });

  // 控制修改项目名称弹框是否显示
  handleUpdateBatchNameModalVisible = flag =>
    this.setState({ updateBatchNameModalVisible: !!flag });

  /** 控制新增卡片弹框是否显示 */
  handleAddNewCardModalVisible = flag => this.setState({ addNewCardModalVisible: !!flag });

  /** 控制查看明细弹框是否显示 */
  handleCheckDetailsModalVisible = flag => this.setState({ checkDetailsModalVisible: !!flag });

  // 打开出卡弹框
  openCreateCardModal = type => {
    const { optionsInitialized } = this.state;
    if (!optionsInitialized) {
      const { dispatch } = this.props;
      dispatch({ type: 'createTask/queryAllGroupNames' });
      dispatch({ type: 'createTask/queryAllProjectNames' });
      dispatch({ type: 'createTask/queryAllBankNames' });
      this.setState({ optionsInitialized: true });
    }

    switch (type) {
      case 'money':
        this.handleCreatByMoneyVisible(true);
        break;
      case 'qty':
        this.handleCreatByQtyVisible(true);
        break;
      default:
        break;
    }
  };

  /** 打开查看明细弹框 */
  openCheckDetailsModal = () => {
    const { checkDetailsModalKey } = this.state;
    this.setState({
      checkDetailsModalKey: checkDetailsModalKey + 1,
      checkDetailsModalVisible: true,
    });
  };

  // 渲染查询条件表单
  renderConditionForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { curDay, expandForm } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 16, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('dateRange', {
                initialValue: [moment(curDay), moment(curDay)],
                rules: [{ required: true, message: '请选择日期' }],
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="批次">
              {getFieldDecorator('batchName')(<Input placeholder="请输入批次名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="出卡人">
              {getFieldDecorator('createUser')(<Input placeholder="请输入出卡人" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="类型">
                {getFieldDecorator('taskType')(
                  <Select placeholder="请选择出卡类型" allowClear style={{ width: '100%' }}>
                    <Option value="0">金额出卡</Option>
                    <Option value="1">数量出卡</Option>
                    <Option value="2">卡号出卡</Option>
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
          <Row gutter={{ md: 6, lg: 16, xl: 24 }}>
            <Col md={6} sm={24}>
              <FormItem label="序号">
                {getFieldDecorator('batchId')(<Input placeholder="请输入序号" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="归档">
                {getFieldDecorator('isArchive')(
                  <Select placeholder="请选择归档状态" allowClear style={{ width: '100%' }}>
                    <Option value="0">未归档</Option>
                    <Option value="1">已归档</Option>
                  </Select>
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
      createTask: { data, groupNames, projectNames, bankNames },
      dispatch,
      loading,
      saveTaskLoading,
      updateBatchNameLoading,
      addNewCardLoading,
      checkDetailsLoading,
    } = this.props;
    const {
      selectedRows,
      selectedRowKeys,
      createByMoneyModalVisible,
      createByQtyModalVisible,
      createByCardNoModalVisible,
      updateBatchNameModalVisible,
      addNewCardModalVisible,
      checkDetailsModalVisible,
      checkDetailsModalKey,
    } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized
                authority={[authority.cardmanager, authority.admin, authority.superadmin]}
              >
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.openCreateCardModal('money')}
                >
                  金额出卡
                </Button>
                <Button icon="plus" type="primary" onClick={() => this.openCreateCardModal('qty')}>
                  数量出卡
                </Button>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleCreatByCardNoVisible(true)}
                >
                  卡号出卡
                </Button>
                <Button
                  icon="edit"
                  disabled={selectedRows.length !== 1}
                  onClick={() => this.handleUpdateBatchNameModalVisible(true)}
                >
                  修改批次名
                </Button>
                <Button
                  icon="delete"
                  disabled={selectedRows.length !== 1}
                  onClick={this.deleteTask}
                >
                  删除任务
                </Button>
                <Button
                  icon="file-add"
                  disabled={selectedRows.length !== 1}
                  onClick={this.openAddNewCardModal}
                >
                  新增卡片
                </Button>
              </Authorized>
              <div className={styles.floatRight}>
                <Button icon="download" onClick={this.exportExcelTable}>
                  导出列表
                </Button>
                <Button
                  icon="download"
                  disabled={selectedRows.length !== 1}
                  onClick={this.exportExcelOne}
                >
                  导出明细
                </Button>
                <Button
                  icon="eye"
                  disabled={selectedRows.length === 0}
                  onClick={this.openCheckDetailsModal}
                >
                  查看明细文本
                </Button>
                <Button
                  icon="download"
                  disabled={selectedRows.length === 0}
                  onClick={this.exportTxt}
                >
                  导出明细文本
                </Button>
              </div>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateByMoneyModal
          visible={createByMoneyModalVisible}
          handleModalVisible={this.handleCreatByMoneyVisible}
          groupNames={groupNames}
          projectNames={projectNames}
          bankNames={bankNames}
          createTask={this.createTask}
          loading={saveTaskLoading}
        />
        <CreateByQtyModal
          visible={createByQtyModalVisible}
          handleModalVisible={this.handleCreatByQtyVisible}
          groupNames={groupNames}
          projectNames={projectNames}
          bankNames={bankNames}
          createTask={this.createTask}
          loading={saveTaskLoading}
        />
        <CreateByCardNoModal
          visible={createByCardNoModalVisible}
          handleModalVisible={this.handleCreatByCardNoVisible}
          createTask={this.createTask}
          loading={saveTaskLoading}
        />
        <UpdateBatchNameModal
          visible={updateBatchNameModalVisible}
          handleModalVisible={this.handleUpdateBatchNameModalVisible}
          updateBatchName={this.updateBatchName}
          task={selectedRows[0]}
          loading={updateBatchNameLoading}
        />
        <AddNewCardModal
          visible={addNewCardModalVisible}
          handleModalVisible={this.handleAddNewCardModalVisible}
          task={selectedRows[0]}
          addNewCard={this.addNewCard}
          loading={addNewCardLoading}
        />
        <CheckDetailsModal
          visible={checkDetailsModalVisible}
          key={checkDetailsModalKey}
          dispatch={dispatch}
          handleModalVisible={this.handleCheckDetailsModalVisible}
          ids={selectedRowKeys}
          loading={checkDetailsLoading}
        />
      </PageHeaderWrapper>
    );
  }
}

export default createTaskList;
