import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, DatePicker } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination } from '@/constant';
import { num2Str } from '@/utils/utils';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;

@connect(({ cardStatistic, loading }) => ({
  cardStatistic,
  loading: loading.models.cardStatistic,
}))
@Form.create()
class CardStatisticList extends PureComponent {
  state = {
    curDay: null,
    expandForm: false,
    conditions: {},
    pagination: {
      current: 1,
      pageSize: defaultPagination.pageSize,
    },
  };

  componentDidMount() {
    this.fetchCurDay();
  }

  getColumns = () => {
    const {
      cardStatistic: { total },
    } = this.props;
    return [
      {
        title: '合计',
        children: [
          {
            title: '序号',
            dataIndex: 'id',
            sorter: true,
            width: 50,
          },
          {
            title: '项目',
            dataIndex: 'operatorProject',
            sorter: true,
            width: 50,
          },
          {
            title: '银行',
            dataIndex: 'bankName',
            sorter: true,
            width: 50,
          },
          {
            title: '小组',
            dataIndex: 'operatorTeam',
            sorter: true,
            width: 50,
          },
          {
            title: '组员',
            dataIndex: 'operatorNickName',
            sorter: true,
            width: 50,
          },
          {
            title: '卡号',
            dataIndex: 'cardNo',
            sorter: true,
            width: 100,
          },
        ],
      },
      {
        title: num2Str(total.totalPlan),
        children: [
          {
            title: '计划',
            dataIndex: 'totalPlan',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.shouldInAmount),
        children: [
          {
            title: '应收',
            dataIndex: 'shouldInAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.allInAmount),
        children: [
          {
            title: '总入',
            dataIndex: 'allInAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.inAmount),
        children: [
          {
            title: '审计',
            dataIndex: 'inAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.unbindAmount),
        children: [
          {
            title: '未匹配',
            dataIndex: 'unbindAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.extraAmount),
        children: [
          {
            title: '额外',
            dataIndex: 'extraAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.outAmount),
        children: [
          {
            title: '总出',
            dataIndex: 'outAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.zfbWithdrawAmount),
        children: [
          {
            title: '支付宝',
            dataIndex: 'zfbWithdrawAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.exchangeWithdrawAmount),
        children: [
          {
            title: '兑换',
            dataIndex: 'exchangeWithdrawAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.spendWithdrawAmount),
        children: [
          {
            title: '开支',
            dataIndex: 'spendWithdrawAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.frozeWithdrawAmount),
        children: [
          {
            title: '冻结',
            dataIndex: 'frozeWithdrawAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.zaifeiWithdrawAmount),
        children: [
          {
            title: '杂费',
            dataIndex: 'zaifeiWithdrawAmount',
            sorter: true,
            width: 50,
          },
        ],
      },
      {
        title: num2Str(total.diffAllInOut),
        children: [
          {
            title: '总入-出',
            dataIndex: 'diffAllInOut',
            sorter: true,
            width: 50,
          },
        ],
      },
    ];
  };

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
          this.fetchDataAndTotal
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
        () => this.fetchDataAndTotal({ current: 1 })
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
        () => this.fetchDataAndTotal({ current: 1 })
      );
    });
  };

  /** 获取列表及汇总数据 */
  fetchDataAndTotal = params => {
    this.fetchData(params);
    this.fetchTotal(params);
  };

  // 获取列表数据
  fetchData = (params = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'cardStatistic/fetch',
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

  // 获取列表汇总数据
  fetchTotal = (params = {}) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'cardStatistic/fetchTotal',
      payload: {
        ...conditions,
        ...pagination,
        ...params,
      },
    });
  };

  exportExcel = () => {
    const { conditions } = this.state;
    window.open(
      `/api/card/exportCardHistory?${stringify({
        startTime: conditions.startTime,
        stopTime: conditions.stopTime,
      })}`,
      '_blank'
    );
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
              <FormItem label="项目">
                {getFieldDecorator('operatorProject')(<Input placeholder="请输入项目" />)}
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
      cardStatistic: { data },
      loading,
    } = this.props;

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
              selectDisabled
              loading={loading}
              data={data}
              columns={this.getColumns()}
              onChange={this.handleStandardTableChange}
              scroll={{ y: 480 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CardStatisticList;
