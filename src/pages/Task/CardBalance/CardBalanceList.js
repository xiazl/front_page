import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, DatePicker, message } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import UpdateModal from '@/pages/Task/CardBalance/Modals/UpdateModal';
import { getPageQuery } from '@/utils/utils';
import { checkAuthority } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import { stringify } from 'qs';
import ImportAmountModal from './Modals/ImportAmountModal';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ cardBalance, loading }) => ({
  cardBalance,
  loading: loading.models.cardBalance,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    const authorities = [authority.operator, authority.teamleader];
    let fixWidth = 1410;
    if (checkAuthority(authorities)) {
      fixWidth = 1490;
    }
    this.state = {
      currentDay: moment().valueOf(),
      expandForm: false,
      conditions: {},
      selectedRows: [],
      selectedRowData: {},
      fixWidth,
      authorities,
      importAmountModalVisible: false,
      pagination: {
        current: 1,
        pageSize: defaultPagination.pageSize,
      },
    };
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

  displayColumn = () => {
    const { authorities } = this.state;
    let columns = [
      {
        title: '银行',
        width: 80,
        dataIndex: 'bankName',
        fixed: 'left',
      },
      {
        title: '省',
        width: 80,
        dataIndex: 'province',
        fixed: 'left',
      },
      {
        title: '市',
        width: 80,
        dataIndex: 'city',
        fixed: 'left',
      },
      {
        title: '户名',
        width: 80,
        dataIndex: 'owner',
        fixed: 'left',
      },
      {
        title: '卡号',
        width: 150,
        dataIndex: 'cardNo',
        fixed: 'left',
      },
      // {
      //   title: '开户行',
      //   dataIndex: 'branchName',
      // },
      {
        title: '小组',
        width: 80,
        dataIndex: 'operatorTeam',
      },
      {
        title: '组员',
        width: 80,
        dataIndex: 'operatorNickName',
      },
      {
        title: '日期',
        width: 150,
        dataIndex: 'date',
        render: text => {
          if (text) {
            return text.slice(0, 10);
          }
          return '';
        },
      },
      {
        title: '昨日余额',
        width: 80,
        dataIndex: 'yestodayRealAmount',
      },
      {
        title: '今日入账',
        width: 80,
        dataIndex: 'todayDepositAmount',
        sorter: true,
      },
      {
        title: '今日出账',
        width: 80,
        dataIndex: 'todayWithdrawAmount',
        sorter: true,
      },
      {
        title: '理论余额',
        width: 80,
        dataIndex: 'theoryAmount',
      },
      {
        title: '实际余额',
        width: 80,
        dataIndex: 'realAmount',
      },
      {
        title: '偏差值',
        width: 80,
        dataIndex: 'subValue',
      },
      {
        title: '备注',
        width: 120,
        dataIndex: 'comment',
      },
    ];

    const operateColumn = [
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        render: record => (
          <Fragment>
            <a onClick={() => this.openUpdateModal(record)}>
              <Icon type="edit" theme="outlined" title="编辑" />
            </a>
          </Fragment>
        ),
      },
    ];

    if (checkAuthority(authorities)) {
      columns = columns.concat(operateColumn);
    }

    return columns;
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
            conditions: { ...conditions, date: curDate },
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

  // 选中行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 重置查询条件
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    // 重置时将时间控件的默认值写入state
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { date, ...rest } = fieldsValue;
      const day = date.format('YYYY-MM-DD');

      this.setState(
        {
          conditions: { ...rest, date: day },
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

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
  };

  // 处理点击查询条件的搜索
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { date, ...rest } = fieldsValue;
      const day = date.format('YYYY-MM-DD');

      this.setState(
        {
          conditions: { ...rest, date: day },
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
      type: 'cardBalance/fetch',
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

  // 控制编辑弹框可见性
  handleUpdateModalVisible = flag => this.setState({ updateModalVisible: !!flag });

  // 控制导入金额弹框可见性
  handleImportAmountModalVisible = flag => this.setState({ importAmountModalVisible: !!flag });

  openUpdateModal = record => {
    this.handleUpdateModalVisible(true);
    this.setState({
      selectedRowData: record,
    });
  };

  // 编辑
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'cardBalance/update',
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

  // 下载模板
  download = () => {
    const { conditions } = this.state;
    window.open(`/api/balance/download?${stringify(conditions)}`, '_blank');
  };

  // 余额导出
  exportExcel = () => {
    const { conditions } = this.state;
    window.open(`/api/balance/export?${stringify(conditions)}`, '_blank');
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
              {getFieldDecorator('date', {
                initialValue: moment(currentDay),
                rules: [{ required: true, message: '请选择日期' }],
              })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="银行">
              {getFieldDecorator('bankName')(<Input placeholder="请输入银行" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="卡号">
              {getFieldDecorator('cardNo')(<Input placeholder="请输入卡号" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="户名">
                {getFieldDecorator('owner')(<Input placeholder="请输入户名" />)}
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
              <FormItem label="小组">
                {getFieldDecorator('operatorTeam')(<Input placeholder="请输入小组" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="组员">
                {getFieldDecorator('operatorNickName')(<Input placeholder="请输入组员昵称" />)}
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
      cardBalance: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      updateModalVisible,
      selectedRowData,
      fixWidth,
      importAmountModalVisible,
    } = this.state;
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized authority={[authority.operator, authority.teamleader, authority.auditor]}>
                <div className={styles.floatRight}>
                  <Authorized authority={[authority.operator, authority.teamleader]}>
                    <Button icon="download" onClick={this.download}>
                      下载导入模版
                    </Button>
                    <Button icon="upload" onClick={() => this.handleImportAmountModalVisible(true)}>
                      导入实际金额
                    </Button>
                  </Authorized>
                  <Button icon="download" onClick={this.exportExcel}>
                    卡片余额导出
                  </Button>
                </div>
              </Authorized>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              rowSelectDisabled="true"
              data={data}
              columns={this.displayColumn()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              selectDisabled="true"
              scroll={{ x: fixWidth, y: 480 }}
            />
          </div>
        </Card>
        <UpdateModal
          modalVisible={updateModalVisible}
          loading={loading}
          handleUpdate={this.handleUpdate}
          handleModalVisible={this.handleUpdateModalVisible}
          selectRows={selectedRowData}
        />
        <ImportAmountModal
          visible={importAmountModalVisible}
          loading={loading}
          handleModalVisible={this.handleImportAmountModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
