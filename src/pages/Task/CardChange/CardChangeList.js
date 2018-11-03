import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, DatePicker, Tag } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination } from '@/constant';
import { getPageQuery } from '@/utils/utils';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ cardChange, loading }) => ({
  cardChange,
  loading: loading.models.cardChange,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
      conditions: {},
      pagination: {
        current: 1,
        pageSize: defaultPagination.pageSize,
      },
    };

    this.columns = [
      {
        title: '项目批次名称',
        dataIndex: 'batchName',
      },
      {
        title: '批次时间',
        dataIndex: 'projectTaskTimeStr',
      },
      {
        title: '原来卡片',
        dataIndex: 'originalCardNo',
        render: text => {
          if (text == null) {
            return '--';
          }
          return text;
        },
      },
      {
        title: '当前卡片',
        dataIndex: 'nowCardNo',
        render: text => {
          if (text == null) {
            return '--';
          }
          return text;
        },
      },
      {
        title: '变更时间',
        dataIndex: 'createTimeStr',
        sorter: true,
      },
      {
        title: '操作人',
        dataIndex: 'userName',
      },
      {
        title: '变更类型',
        dataIndex: 'type',
        render: text => {
          if (text === 0) {
            return <Tag color="#87d068">新增卡片</Tag>;
          }
          if (text === 1) {
            return <Tag color="#2db7f5">更换卡片</Tag>;
          }
          if (text === 2) {
            return <Tag color="#f50">移除卡片</Tag>;
          }
          return '';
        },
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
      type: 'cardChange/fetch',
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

    const { currentDay } = this.state;
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
            <FormItem label="项目批次名称">
              {getFieldDecorator('batchName')(<Input placeholder="请输入项目批次名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="原来卡片">
              {getFieldDecorator('originalCardNo')(<Input placeholder="请输入原来卡片" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="当前卡片">
                {getFieldDecorator('newCardNo')(<Input placeholder="请输入当前卡片" />)}
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
      cardChange: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <StandardTable
              selectDisabled
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
