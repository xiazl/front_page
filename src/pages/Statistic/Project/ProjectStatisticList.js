import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination } from '@/constant';
import { getPageQuery } from '@/utils/utils';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;

@connect(({ projectStatistic, loading }) => ({
  projectStatistic,
  loading: loading.models.projectStatistic,
}))
@Form.create()
class ProjectStatisticList extends PureComponent {
  state = {
    curDay: moment().endOf(),
    selectedRows: [],
    conditions: {},
    pagination: {
      current: 1,
      pageSize: defaultPagination.pageSize,
    },
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      sorter: true,
    },
    {
      title: '批次数量',
      dataIndex: 'batchCount',
    },
    {
      title: '任务数量',
      dataIndex: 'taskCount',
    },
    {
      title: '计划入账',
      dataIndex: 'totalAmountPlan',
      sorter: true,
    },
    {
      title: '应收入账',
      dataIndex: 'totalAmountShould',
      sorter: true,
    },
    {
      title: '审计入账',
      dataIndex: 'totalAmountActual',
      sorter: true,
    },
    {
      title: '差额(应收-审计)',
      dataIndex: 'diffShouldActual',
      sorter: true,
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
      type: 'projectStatistic/fetch',
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
    window.open(`/api/statistical/exportProjectHistoryData?${stringify(conditions)}`, '_blank');
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
  };

  // 渲染查询条件表单
  renderConditionForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { curDay } = this.state;
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
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输项目名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      projectStatistic: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <div className={styles.floatRight}>
                <Button icon="download" onClick={this.exportExcel}>
                  导出数据
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
              rowKey="projectName"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectStatisticList;
