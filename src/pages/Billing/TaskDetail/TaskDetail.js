import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, DatePicker, Cascader, Select } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination } from '@/constant';
import { getPageQuery } from '@/utils/utils';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ billingList, loading }) => ({
  billingList,
  loading: loading.models.billingList,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expandForm: false,
      types: [],
      channels: [],
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
        title: '任务Id',
        dataIndex: 'taskId',
      },
      {
        title: ' 分类',
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
        title: '子任务明细',
        width: '20%',
        dataIndex: 'content',
      },
      {
        title: '账号',
        dataIndex: 'account',
      },
      {
        title: '金额',
        dataIndex: 'amount',
      },
      {
        title: '创建时间',
        width: 110,
        dataIndex: 'createTime',
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
      type: 'billingList/fetchList',
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

    const { currentDay, channels, types } = this.state;
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
              <FormItem label="账号">
                {getFieldDecorator('account')(<Input placeholder="请输入账号" />)}
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
      billingList: { data },
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
