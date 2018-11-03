import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  DatePicker,
  Select,
  Divider,
  message,
  Tag,
  Badge,
} from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import { getPageQuery, filterColumnsByAuthority } from '@/utils/utils';
import FinishModel from '@/pages/Billing/BillingDetail/Modals/FinishModal';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ billingDetail, loading }) => ({
  billingDetail,
  loading: loading.models.billingDetail,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
      finishModalVisible: false,
      selectedRowData: {},
      listStatus: [],
      conditions: {},
      pagination: {
        current: 1,
        pageSize: defaultPagination.pageSize,
      },
    };
    this.columns = [
      {
        title: '卡号',
        width: 120,
        dataIndex: 'cardNo',
        fixed: 'left',
      },
      {
        title: '组员',
        width: 80,
        dataIndex: 'operatorNickName',
        fixed: 'left',
      },
      {
        title: '任务明细',
        width: 200,
        dataIndex: 'content',
        fixed: 'left',
      },
      {
        title: '金额',
        width: 80,
        dataIndex: 'amount',
        fixed: 'left',
      },
      {
        title: '序号',
        width: 80,
        dataIndex: 'id',
      },
      {
        title: '任务明细Id',
        width: 100,
        dataIndex: 'billingId',
      },
      {
        title: '任务级别',
        dataIndex: 'priority',
        width: 60,
        render: text => {
          if (text === 0) {
            return <Tag>普通</Tag>;
          }
          return <Tag color="#f50">优先</Tag>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        render: text => {
          switch (text) {
            case 0:
              return <Badge status="default" text="未处理" />;
            case 1:
              return <Badge status="processing" text="处理中" />;
            case 2:
              return <Badge status="success" text="完成" />;
            case -1:
            default:
              return <Badge status="error" text="失败" />;
          }
        },
      },
      {
        title: '反馈',
        width: 200,
        dataIndex: 'feedback',
      },
      {
        title: '失败原因',
        width: 100,
        dataIndex: 'failedTypeStr',
      },
      {
        title: '创建时间',
        width: 110,
        dataIndex: 'createTime',
      },
      {
        title: '开始时间',
        width: 110,
        dataIndex: 'startTime',
      },
      {
        title: '完成时间',
        width: 110,
        dataIndex: 'finishTime',
      },
      {
        title: '审核时间',
        width: 110,
        dataIndex: 'auditTime',
      },
      {
        authority: [authority.admin, authority.superadmin, authority.operator],
        title: '操作',
        width: 65,
        render: record => (
          <Fragment>
            {record.startTime == null ? (
              <a onClick={() => this.tagTask(record)}>
                <Icon type="play-circle" theme="outlined" title="开始" />
              </a>
            ) : (
              <Icon type="play-circle" theme="outlined" title="开始" />
            )}
            <Divider type="vertical" />
            {(record.finishTime == null && record.startTime != null) === true ? (
              <a onClick={() => this.openFinishModal(record)}>
                <Icon type="check" theme="outlined" title="完成" />
              </a>
            ) : (
              <Icon type="check" theme="outlined" title="完成" />
            )}
          </Fragment>
        ),
        fixed: 'right',
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
  }

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

  // 分类选择
  handleSelect = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billingDetail/listStatus',
      callback: response => {
        if (response.success) {
          this.setState({
            listStatus: response.data,
          });
        }
      },
    });
  };

  // 标记开始
  tagTask = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billingDetail/tag',
      payload: { id: record.id },
      callback: response => {
        if (response.success) {
          message.success('操作成功');
          this.fetchData();
        }
      },
    });
  };

  // 标记完成
  handleFinish = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billingDetail/finish',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('操作成功');
          this.handleFinishModalVisible();
          this.fetchData();
        }
      },
    });
  };

  selectFailedType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billingDetail/failedTypes',
    });
  };

  openFinishModal = record => {
    this.handleFinishModalVisible(true);
    this.setState({
      selectedRowData: record,
    });
    this.selectFailedType();
  };

  // 控制编辑弹框可见性
  handleFinishModalVisible = flag => this.setState({ finishModalVisible: !!flag });

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

  // 获取列表数据
  fetchData = (parmas = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'billingDetail/fetchList',
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

    const { currentDay, listStatus } = this.state;
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
            <FormItem label="任务明细Id">
              {getFieldDecorator('billingId')(<Input placeholder="请输入批次Id" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} allowClear placeholder="请选择状态">
                  {listStatus.map(item => (
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
              <FormItem label="卡号">
                {getFieldDecorator('cardNo')(<Input placeholder="请输入卡号" />)}
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
              <FormItem label="组员">
                {getFieldDecorator('operatorNickName')(<Input placeholder="请输入组员" />)}
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
      billingDetail: { data, failedTypes },
      loading,
    } = this.props;
    const { finishModalVisible, selectedRowData } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <StandardTable
              selectDisabled
              loading={loading}
              data={data}
              columns={filterColumnsByAuthority(this.columns)}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1600, y: 480 }}
            />
          </div>
        </Card>
        <FinishModel
          modalVisible={finishModalVisible}
          loading={loading}
          selectedRow={selectedRowData}
          failedTypes={failedTypes}
          handleFinish={this.handleFinish}
          handleModalVisible={this.handleFinishModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
