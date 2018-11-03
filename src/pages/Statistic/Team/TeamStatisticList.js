import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Table, Button, DatePicker } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { authority, defaultPagination } from '@/constant';
import { checkAuthority } from '@/utils/authority';
import Authorized from '@/utils/Authorized';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;

const { RangePicker } = DatePicker;

/** 构建含children的表头 */
const buildColumnAndChildren = (data, fields, lastChildren) => {
  const columns = [];
  fields.forEach((field, index) => {
    let column = {};
    let children;
    columns.push(column);
    data.forEach(item => {
      column.title = field === '/' ? '/' : item[field];
      column.title = !column.title && column.title !== 0 ? '' : column.title; // 将 null 或 undefined 转为 '', 0不变
      column.children = [{}];
      children = column.children;
      column = children[0];
    });
    children[0] = lastChildren[index];
  });
  return columns;
};

@connect(({ teamStatistic, loading }) => ({
  teamStatistic,
  loading: loading.models.teamStatistic,
}))
@Form.create()
class TeamStatisticList extends PureComponent {
  state = {
    curDay: moment().valueOf(),
  };

  columns = [
    {
      title: '组员',
      dataIndex: 'nickName',
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      sorter: (a, b) => {
        if (a.bankName < b.bankName) {
          return -1;
        }
        if (a.bankName > b.bankName) {
          return 1;
        }
        return 0;
      },
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
      title: '未出账',
      dataIndex: 'leftAmount',
      sorter: (a, b) => {
        if (a.leftAmount < b.leftAmount) {
          return -1;
        }
        if (a.leftAmount > b.leftAmount) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: '总入账',
      dataIndex: 'totalDepositAmount',
      sorter: (a, b) => {
        if (a.totalDepositAmount < b.totalDepositAmount) {
          return -1;
        }
        if (a.totalDepositAmount > b.totalDepositAmount) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: '总出账',
      dataIndex: 'totalWithdrawAmount',
      sorter: (a, b) => {
        if (a.totalWithdrawAmount < b.totalWithdrawAmount) {
          return -1;
        }
        if (a.totalWithdrawAmount > b.totalWithdrawAmount) {
          return 1;
        }
        return 0;
      },
    },
    {
      title: '支付宝出账',
      dataIndex: 'zfbAmount',
    },
    {
      title: '兑换出账',
      dataIndex: 'dhAmount',
    },
    {
      title: '开支出账',
      dataIndex: 'kzAmount',
    },
    {
      title: '冻结出账',
      dataIndex: 'djAmount',
    },
    {
      title: '杂费出账',
      dataIndex: 'zfAmount',
    },
    {
      title: '卡余额',
      dataIndex: 'remainingAmount',
      sorter: (a, b) => {
        if (a.remainingAmount < b.remainingAmount) {
          return -1;
        }
        if (a.remainingAmount > b.remainingAmount) {
          return 1;
        }
        return 0;
      },
    },
  ];

  componentDidMount() {
    this.fetchCurDay();
  }

  getColumns = () => {
    const {
      teamStatistic: {
        data: { head = [] },
      },
    } = this.props;
    let columns = [];
    const isHeadEmpty = !head || head.length === 0;

    if (isHeadEmpty) {
      if (checkAuthority(authority.teamleader)) {
        columns = columns.concat(this.columns.slice(0, 1));
      } else if (checkAuthority(authority.operator)) {
        columns = columns.concat(this.columns.slice(0, 4));
      }
      columns = columns.concat(this.columns.slice(4));
      return columns;
    }

    if (checkAuthority(authority.teamleader)) {
      columns = columns.concat(
        buildColumnAndChildren(head, ['teamName'], this.columns.slice(0, 1))
      );
    } else if (checkAuthority(authority.operator)) {
      columns = columns.concat(
        buildColumnAndChildren(head, ['nickName', '/', '/', '/'], this.columns.slice(0, 4))
      );
    }

    columns = columns.concat(
      buildColumnAndChildren(
        head,
        [
          'leftAmount',
          'totalDepositAmount',
          'totalWithdrawAmount',
          'zfbAmount',
          'dhAmount',
          'kzAmount',
          'djAmount',
          'zfAmount',
          'remainingAmount',
        ],
        this.columns.slice(4)
      )
    );

    return columns;
  };

  // 从后台获取当天业务日期
  fetchCurDay = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/fetchCurDay',
      callback: response => {
        let curDate = moment().format('YYYY-MM-DD');
        if (response.success) {
          curDate = moment(response.data).format('YYYY-MM-DD');

          this.setState({
            curDay: response.data,
          });
        }

        this.fetchData({ startTime: curDate, stopTime: curDate });
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

      this.fetchData({ ...rest, startTime, stopTime });
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

      this.fetchData({ ...rest, startTime, stopTime });
    });
  };

  // 获取列表数据
  fetchData = (params = {}) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'teamStatistic/fetch',
      payload: params,
    });
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
          {checkAuthority(authority.teamleader) && [
            <Col md={6} sm={24} key="nickName">
              <FormItem label="组员">
                {getFieldDecorator('nickName')(<Input placeholder="请输入组员" />)}
              </FormItem>
            </Col>,
            <Col md={6} sm={24} key="userTeam">
              <FormItem label="小组">
                {getFieldDecorator('userTeam')(<Input placeholder="请输入小组" />)}
              </FormItem>
            </Col>,
            <Col md={6} sm={24} key="submit">
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </Col>,
          ]}
          {checkAuthority(authority.operator) && [
            <Col md={6} sm={24} key="bankName">
              <FormItem label="银行">
                {getFieldDecorator('bankName')(<Input placeholder="请输入银行" />)}
              </FormItem>
            </Col>,
            <Col md={6} sm={24} key="owner">
              <FormItem label="持卡人">
                {getFieldDecorator('owner')(<Input placeholder="请输入持卡人" />)}
              </FormItem>
            </Col>,
            <Col md={6} sm={24} key="cardNo">
              <FormItem label="卡号">
                {getFieldDecorator('cardNo')(<Input placeholder="请输入卡号" />)}
              </FormItem>
            </Col>,
          ]}
        </Row>
        <Authorized authority={[authority.operator]}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </div>
        </Authorized>
      </Form>
    );
  }

  render() {
    const {
      teamStatistic: {
        data: { body, time },
      },
      loading,
    } = this.props;

    let rowKey = 'id';
    if (checkAuthority(authority.teamleader)) {
      rowKey = 'nickName';
    } else if (checkAuthority(authority.operator)) {
      rowKey = 'cardNo';
    }
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <Table
              className="team-statistic-list"
              key={time}
              rowKey={rowKey}
              loading={loading}
              columns={this.getColumns()}
              dataSource={body}
              pagination={{
                ...defaultPagination,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条记录，共${total}条`,
              }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TeamStatisticList;
