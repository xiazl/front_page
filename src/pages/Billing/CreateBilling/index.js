import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Row,
  Col,
  Card,
  Form,
  Icon,
  Button,
  DatePicker,
  message,
  Select,
  Cascader,
  Tag,
  Divider,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import { getPageQuery } from '@/utils/utils';
import CreateModel from '@/pages/Billing/CreateBilling/Modals/CreateModal2';
import Authorized from '@/utils/Authorized';
import PrivateGroupSetting from '@/pages/Billing/CreateBilling/Modals/PrivateGroupSetting';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ createBilling, loading }) => ({
  createBilling,
  loading: loading.models.createBilling,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      channels: [],
      selectedRowKeys: [],
      types: [],
      createModalVisible: false,
      privateGroupVisible: false,
      expandForm: false,
      conditions: {},
      pagination: {
        current: 1,
        pageSize: defaultPagination.pageSize,
      },
    };
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '分类',
        dataIndex: 'secondaryType',
        render: (text, record) => `${record.mainTypeStr}/${record.secondaryTypeStr}`,
      },
      {
        title: '渠道',
        dataIndex: 'channelStr',
      },
      {
        title: '最低金额',
        dataIndex: 'minAmountLimit',
      },
      {
        title: '最高金额',
        dataIndex: 'maxAmountLimit',
      },
      {
        title: '次数限制',
        dataIndex: 'countLimit',
      },
      {
        title: '出卡小组',
        dataIndex: 'groups',
      },
      {
        title: '统一金额',
        dataIndex: 'unityAmount',
      },
      {
        title: '概述',
        width: '20%',
        dataIndex: 'contentSummary',
      },
      {
        title: '总金额',
        dataIndex: 'totalAmount',
      },
      {
        title: '已完成金额',
        dataIndex: 'finishAmount',
      },
      {
        title: '任务级别',
        width: 80,
        dataIndex: 'priority',
        render: text => {
          if (text === 0) {
            return <Tag>普通</Tag>;
          }
          return <Tag color="#f50">优先</Tag>;
        },
      },
      {
        title: '创建时间',
        width: 110,
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        width: 70,
        authority: [authority.admin, authority.superadmin, authority.billingmanager],
        render: record => (
          <Fragment>
            {record.priority === 0 ? (
              <a onClick={() => this.updatePriority(record)}>
                <Icon type="to-top" title="调整优先级" />
              </a>
            ) : (
              <Icon type="to-top" theme="outlined" title="调整优先级" />
            )}
            <Divider type="vertical" />
            <a onClick={() => this.deleteTask(record)}>
              <Icon type="delete" theme="outlined" title="删除" />
            </a>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    const { date } = getPageQuery();
    if (date) {
      const currentDay = Number(date);
      const curDate = moment(currentDay).format('YYYY-MM-DD');
      const { conditions } = this.state;
      this.setState(
        { currentDay, conditions: { ...conditions, startTime: curDate, stopTime: curDate } },
        this.fetchData
      );
    } else {
      this.fetchCurrentDay();
    }

    this.handleSelect();
    this.selectChannel();
  }

  // 控制弹框可见性
  handleCreateModalVisible = flag => this.setState({ createModalVisible: !!flag });

  // 控制专用组设置弹框可见性
  handlePrivateGroupVisible = flag => this.setState({ privateGroupVisible: !!flag });

  // 获取专用组列表
  getPrivateGroupList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createBilling/getPrivateGroup',
    });
  };

  // 打开专用组设置弹框
  openPrivateGroupModal = () => {
    this.handlePrivateGroupVisible(true);
    this.getPrivateGroupList();
  };

  // 从后台获取当天业务日期
  fetchCurrentDay = () => {
    const { conditions } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'global/fetchCurDay',
      callback: response => {
        let currentDay = moment().valueOf();
        if (response.success) {
          currentDay = response.data;
        }

        const curDate = moment(currentDay).format('YYYY-MM-DD');
        this.setState(
          {
            currentDay,
            conditions: { ...conditions, startTime: curDate, stopTime: curDate },
          },
          this.fetchData
        );
      },
    });
  };

  openCreateModal = () => {
    this.handleCreateModalVisible(true);
    this.selectTypes();
    this.selectChannel();
    this.selectGroups();
  };

  selectTypes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createBilling/listTypes',
    });
  };

  selectGroups = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createBilling/listGroupNames',
    });
  };

  // 列表渠道选择
  selectChannel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createBilling/listChannels',
      callback: response => {
        if (response.success) {
          this.setState({
            channels: response.data,
          });
        }
      },
    });
  };

  // 分类选择
  handleSelect = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createBilling/listTypes',
      callback: response => {
        if (response.success) {
          this.setState({
            types: response.data,
          });
        }
      },
    });
  };

  // 选中行
  handleSelectRows = (rows, rowKeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowKeys,
    });
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
    this.setState({ selectedRowKeys: [] });
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

  // 删除
  deleteTask = record => {
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
          type: 'createBilling/delete',
          payload: { ids: ids || selectedRowKeys },
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

  /** 变更优先级 */
  updatePriority = record => {
    const { dispatch } = this.props;
    const { id } = record;

    Modal.confirm({
      title: '确定要将任务级别调整为[优先]？',
      content: '',
      onOk: () => {
        dispatch({
          type: 'createBilling/updatePriority',
          payload: { id },
          callback: response => {
            if (response.success) {
              message.success('修改成功');
              this.fetchData();
            }
          },
        });
      },
    });
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

  // 保存
  handleCreate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createBilling/add',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('创建成功');
          this.handleCreateModalVisible();
          this.fetchData();
        }
      },
    });
  };

  // 获取列表数据
  fetchData = (parmas = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'createBilling/fetchTask',
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

  // 渲染查询条件表单
  renderConditionForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { currentDay, types, channels } = this.state;
    const { expandForm } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('dateRange', {
                initialValue: [moment(currentDay), moment(currentDay)],
                rules: [{ required: true, message: '请选择日期' }],
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分类">
              {getFieldDecorator('type')(
                <Cascader
                  fieldNames={{ label: 'value', value: 'key', children: 'items' }}
                  options={types}
                  placeholder="请选选择分类"
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="渠道">
              {getFieldDecorator('channel')(
                <Select style={{ width: '100%' }} allowClear placeholder="请选择渠道">
                  {channels.map(item => (
                    <Option key={item.key} value={`${item.key}`}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="任务级别">
                {getFieldDecorator('priority')(
                  <Select style={{ width: '100%' }} allowClear placeholder="请选择任务级别">
                    <Option value="0">普通</Option>
                    <Option value="1">优先</Option>
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
      dispatch,
      createBilling: { data, types, groupNames, channels, privateGroup },
      loading,
    } = this.props;

    const { createModalVisible, privateGroupVisible, selectedRows } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized
                authority={[authority.superadmin, authority.admin, authority.billingmanager]}
              >
                <Button icon="plus" type="primary" onClick={this.openCreateModal}>
                  创建任务
                </Button>
                <Button
                  icon="delete"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={this.deleteTask}
                >
                  批量删除
                </Button>

                <div className={styles.floatRight}>
                  <Button icon="setting" onClick={this.openPrivateGroupModal}>
                    专用小组设置
                  </Button>
                </div>
              </Authorized>
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
        <CreateModel
          modalVisible={createModalVisible}
          loading={loading}
          types={types}
          channels={channels}
          groupNames={groupNames}
          handleCreate={this.handleCreate}
          handleModalVisible={this.handleCreateModalVisible}
        />
        <PrivateGroupSetting
          modalVisible={privateGroupVisible}
          loading={loading}
          handleModalVisible={this.handlePrivateGroupVisible}
          data={privateGroup}
          getPrivateGroupList={this.getPrivateGroupList}
          dispatch={dispatch}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
