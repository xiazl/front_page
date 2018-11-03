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
  Select,
} from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import ExamineModal from '@/pages/Statistic/Task/Modals/ExamineModal';
import Authorized from '@/utils/Authorized';
import { getPageQuery } from '@/utils/utils';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ taskStatistic, loading }) => ({
  taskStatistic,
  loading: loading.models.taskStatistic,
}))
@Form.create()
class TaskStatisticList extends PureComponent {
  state = {
    examineModalVisible: false,
    curDay: moment().endOf(),
    expandForm: false,
    selectedRows: [],
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
      title: '批次',
      dataIndex: 'batchName',
    },
    {
      title: '时间',
      dataIndex: 'taskTimeStr',
    },
    {
      title: '银行',
      dataIndex: 'bankName',
    },
    {
      title: '持卡人',
      dataIndex: 'owner',
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
    },
    {
      title: '省',
      dataIndex: 'province',
    },
    {
      title: '计划',
      dataIndex: 'amountPlan',
    },
    {
      title: '应收',
      dataIndex: 'amountShould',
    },
    {
      title: '审计',
      dataIndex: 'amountReal',
      sorter: true,
    },
    {
      title: '小组',
      dataIndex: 'userTeam',
    },
    {
      title: '组员',
      dataIndex: 'userName',
    },
    {
      title: '审核',
      dataIndex: 'examine',
      render: text => {
        if (text === 1) {
          return <Badge status="success" text="通过" />;
        }
        if (text === 2) {
          return <Badge status="error" text="未通过" />;
        }
        return '';
      },
    },
    {
      title: '审核意见',
      dataIndex: 'examineComment',
    },
  ];

  componentDidMount() {
    const { date } = getPageQuery();
    if (date) {
      const curDay = Number(date);
      const curDate = moment(curDay).format('YYYY-MM-DD');
      const { conditions } = this.state;
      this.setState(
        { curDay, conditions: { ...conditions, startTime: curDate, stopTime: curDate } },
        this.fetchData
      );
      return;
    }
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
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
      type: 'taskStatistic/fetch',
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

  exportExcel = () => {
    const { conditions } = this.state;
    window.open(`/api/statistical/exportTaskStatisticl?${stringify(conditions)}`, '_blank');
  };

  exportTxt = () => {
    const { conditions } = this.state;
    window.open(`/api/statistical/exportTaskStatisticlTxt?${stringify(conditions)}`, '_blank');
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
  };

  // 控制编辑弹框可见性
  handleExamineModalVisible = flag => this.setState({ examineModalVisible: !!flag });

  // 新增
  handleExamine = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskStatistic/examine',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('审核成功');
          this.handleExamineModalVisible();
          this.fetchData();
        }
      },
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
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('dateRange', {
                initialValue: [moment(curDay), moment(curDay)],
                rules: [{ required: true, message: '请选择日期' }],
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="卡号">
              {getFieldDecorator('cardNo')(<Input placeholder="请输入卡号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="组员">
              {getFieldDecorator('operatorNickName')(<Input placeholder="请输入组员昵称" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="小组">
                {getFieldDecorator('operatorTeam')(<Input placeholder="请输入小组" />)}
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
              <FormItem label="序号">
                {getFieldDecorator('id')(<Input placeholder="请输入序号" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="银行">
                {getFieldDecorator('bankName')(<Input placeholder="请输入银行名称" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="批次">
                {getFieldDecorator('batchName')(<Input placeholder="请输入批次" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="审核">
                {getFieldDecorator('examine')(
                  <Select placeholder="请选择审核状态" allowClear style={{ width: '100%' }}>
                    <Option value="1">通过</Option>
                    <Option value="2">未通过</Option>
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
      taskStatistic: { data },
      loading,
    } = this.props;
    const { selectedRows, examineModalVisible } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized authority={[authority.auditor, authority.admin, authority.superadmin]}>
                <Button
                  icon="check"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={() => this.handleExamineModalVisible(true)}
                >
                  审核
                </Button>
              </Authorized>
              <div className={styles.floatRight}>
                <Button icon="download" onClick={this.exportExcel}>
                  导出Excel
                </Button>
                <Authorized
                  authority={[authority.cardmanager, authority.admin, authority.superadmin]}
                >
                  <Button icon="download" onClick={this.exportTxt}>
                    导出文本
                  </Button>
                </Authorized>
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
        <ExamineModal
          modalVisible={examineModalVisible}
          loading={loading}
          handleExamine={this.handleExamine}
          handleModalVisible={this.handleExamineModalVisible}
          tasks={selectedRows}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TaskStatisticList;
