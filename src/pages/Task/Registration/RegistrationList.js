import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, message, DatePicker, Select, Tag } from 'antd';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import Authorized from '@/utils/Authorized';
import AddDepositByTxtModal from './Modals/AddDepositByTxtModal';
import AddBillingByTxtModal from './Modals/AddBillingByTxtModal';
import AddDepositModal from './Modals/AddDepositModal';
import AddBillingModal from './Modals/AddBillingModa';
import CardDepositDetail from './Modals/CardDepositDetail';
import CardBillingDetail from './Modals/CardBillingDetail';
import numeral from 'numeral';
import styles from '@/pages/TableLayout.less';
import { checkAuthority } from '@/utils/authority';
import { num2Str } from '@/utils/utils';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;

@connect(({ registration, loading }) => ({
  registration,
  loading: loading.models.registration,
  depositLoading: loading.effects['registration/queryDepositDetails'],
  billingLoading: loading.effects['registration/queryBillingDetails'],
}))
@Form.create()
class registrationList extends PureComponent {
  state = {
    addDepositByTxtModalVisible: false,
    addBillingByTxtModalVisible: false,
    addDepositModalVisible: false,
    addBillingModalVisible: false,
    cardDepositDetailVisible: false,
    cardBillingDetailVisible: false,
    curDay: moment().valueOf(),
    expandForm: false,
    selectedRows: [],
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
      registration: { total },
    } = this.props;

    return [
      {
        title: '合计',
        children: [
          {
            title: '序号',
            dataIndex: 'cardId',
          },
          {
            title: '银行',
            dataIndex: 'bankName',
          },
          {
            title: '户名',
            dataIndex: 'owner',
          },
          {
            title: '卡号',
            dataIndex: 'cardNo',
          },
          {
            title: '开户省',
            dataIndex: 'province',
          },
          {
            title: '开户市',
            dataIndex: 'city',
          },
          {
            title: '开户行',
            dataIndex: 'branchName',
          },
          {
            title: '组员',
            dataIndex: 'operatorNickName',
          },
          {
            title: '状态',
            dataIndex: 'isDisable',
            render: text => {
              if (text === 0) {
                return <Tag color="green">启用</Tag>;
              }
              if (text === 1) {
                return <Tag color="red">停用</Tag>;
              }
              return <Tag color="yellow">未知</Tag>;
            },
          },
        ],
      },
      {
        title: num2Str(total.cardTaskCount),
        children: [
          {
            title: '出卡次数',
            dataIndex: 'cardTaskCount',
          },
        ],
      },
      {
        title: num2Str(total.depositCount),
        children: [
          {
            title: '入账次数',
            dataIndex: 'depositCount',
          },
        ],
      },
      {
        title: num2Str(total.withdrawCount),
        children: [
          {
            title: '出账次数',
            dataIndex: 'withdrawCount',
          },
        ],
      },
      {
        title: num2Str(total.depositAmount),
        children: [
          {
            title: '入账额',
            dataIndex: 'depositAmount',
          },
        ],
      },
      {
        title: num2Str(total.withdrawAmount),
        children: [
          {
            title: '出账额',
            dataIndex: 'withdrawAmount',
          },
        ],
      },
      {
        title: num2Str(
          numeral(total.depositAmount - total.withdrawAmount).format('0,0[.][000000]')
        ),
        children: [
          {
            title: '入-出',
            key: 'diff',
            render: record =>
              numeral(record.depositAmount - record.withdrawAmount).format('0,0[.][000000]'),
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
      type: 'registration/fetch',
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
      type: 'registration/fetchTotal',
      payload: {
        ...conditions,
        ...pagination,
        ...params,
      },
    });
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
  };

  // 控制文本入账弹框可见性
  handleAddDepositByTxtModalVisible = flag =>
    this.setState({ addDepositByTxtModalVisible: !!flag });

  // 控制文本出账弹框可见性
  handleAddBillingByTxtModalVisible = flag =>
    this.setState({ addBillingByTxtModalVisible: !!flag });

  // 控制新增入账弹框可见性
  handleAddDepositModalVisible = flag => this.setState({ addDepositModalVisible: !!flag });

  // 控制新增出账弹框可见性
  handleAddBillingModalVisible = flag => this.setState({ addBillingModalVisible: !!flag });

  // 控制查看入账明细弹窗
  handleCardDepositDetailVisible = flag => this.setState({ cardDepositDetailVisible: !!flag });

  // 控制查看出账明细弹窗
  handleCardBillingDetailVisible = flag => this.setState({ cardBillingDetailVisible: !!flag });

  // 新增文本入账
  handleAddDepositByTxt = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'registration/addDepositByTxt',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('增加入账成功');
          this.handleAddDepositByTxtModalVisible();
          this.fetchData();
        }
      },
    });
  };

  // 新增文本出账
  handleAddBillingByTxt = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'registration/addBillingByTxt',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('增加出账成功');
          this.handleAddBillingByTxtModalVisible();
          this.fetchData();
        }
      },
    });
  };

  // 新增入账
  handleAddDeposit = (fields, form) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'registration/addDeposit',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('增加入账成功');
          this.fetchData();
        }
      },
    });
  };

  // 新增出账
  handleAddBilling = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'registration/addBilling',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('增加出账成功');
          this.fetchData();
        }
      },
    });
  };

  // 获取入账明细列表
  getDepositDetailList = () => {
    const { dispatch } = this.props;
    const { selectedRows, conditions } = this.state;
    const { startTime, stopTime } = conditions;

    dispatch({
      type: 'registration/queryDepositDetails',
      payload: { cardId: selectedRows[0].cardId, startTime, stopTime },
    });
  };

  // 打开入账明细弹框
  openDepositDetailModal = () => {
    this.handleCardDepositDetailVisible(true);
    this.getDepositDetailList();
  };

  // 获取出账明细列表
  getBillingDetailList = () => {
    const { dispatch } = this.props;
    const { selectedRows, conditions } = this.state;
    const { startTime, stopTime } = conditions;

    dispatch({
      type: 'registration/queryBillingDetails',
      payload: { cardId: selectedRows[0].cardId, startTime, stopTime },
    });
  };

  // 打开入账明细弹框
  openBillingDetailModal = () => {
    this.handleCardBillingDetailVisible(true);
    this.getBillingDetailList();
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
            <FormItem label="类型">
              {getFieldDecorator('bankName')(<Input placeholder="请输入银行名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="卡号">
              {getFieldDecorator('cardNo')(<Input placeholder="请输入卡号" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="状态">
                {getFieldDecorator('isDisable')(
                  <Select allowClear style={{ width: '100%' }}>
                    <Option key="0" value="0">
                      启用
                    </Option>
                    <Option key="1" value="1">
                      停用
                    </Option>
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
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="序号">
                {getFieldDecorator('cardId')(<Input placeholder="请输入卡片序号" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="户名">
                {getFieldDecorator('owner')(<Input placeholder="请输入户名" />)}
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
      dispatch,
      registration: { data, depositDetailList, billingDetailList },
      loading,
      depositLoading,
      billingLoading,
    } = this.props;
    const {
      selectedRows,
      addDepositByTxtModalVisible,
      addBillingByTxtModalVisible,
      addDepositModalVisible,
      addBillingModalVisible,
      cardDepositDetailVisible,
      cardBillingDetailVisible,
    } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized authority={[authority.operator]}>
                <Button
                  icon="file-text"
                  type="primary"
                  onClick={() => this.handleAddDepositByTxtModalVisible(true)}
                >
                  文本入账
                </Button>
                <Button
                  icon="file-text"
                  type="primary"
                  onClick={() => this.handleAddBillingByTxtModalVisible(true)}
                >
                  文本出账
                </Button>
                {/* <Button
                  icon="plus"
                  type="primary"
                  disabled={selectedRows.length !== 1}
                  onClick={() => this.handleAddDepositModalVisible(true)}
                >
                  新增入账
                </Button>
                <Button
                  icon="plus"
                  type="primary"
                  disabled={selectedRows.length !== 1}
                  onClick={() => this.handleAddBillingModalVisible(true)}
                >
                  新增出账
                </Button> */}
                <Button
                  icon="eye"
                  type="primary"
                  disabled={selectedRows.length !== 1}
                  onClick={this.openDepositDetailModal}
                >
                  查看入账
                </Button>
                <Button
                  icon="eye"
                  type="primary"
                  disabled={selectedRows.length !== 1}
                  onClick={this.openBillingDetailModal}
                >
                  查看出账
                </Button>
              </Authorized>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.getColumns()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="cardId"
              type="radio"
              selectDisabled={checkAuthority(authority.teamleader)}
              rowSelectDisabled
            />
          </div>
        </Card>
        <AddDepositByTxtModal
          modalVisible={addDepositByTxtModalVisible}
          loading={loading}
          handleAddDepositByTxt={this.handleAddDepositByTxt}
          handleModalVisible={this.handleAddDepositByTxtModalVisible}
        />
        <AddBillingByTxtModal
          modalVisible={addBillingByTxtModalVisible}
          loading={loading}
          handleAddBillingByTxt={this.handleAddBillingByTxt}
          handleModalVisible={this.handleAddBillingByTxtModalVisible}
        />
        <AddDepositModal
          modalVisible={addDepositModalVisible}
          loading={loading}
          handleAddDeposit={this.handleAddDeposit}
          handleModalVisible={this.handleAddDepositModalVisible}
          card={selectedRows[0]}
        />
        <AddBillingModal
          modalVisible={addBillingModalVisible}
          loading={loading}
          handleAddBilling={this.handleAddBilling}
          handleModalVisible={this.handleAddBillingModalVisible}
          card={selectedRows[0]}
        />
        <CardDepositDetail
          modalVisible={cardDepositDetailVisible}
          loading={depositLoading}
          handleModalVisible={this.handleCardDepositDetailVisible}
          data={depositDetailList}
          dispatch={dispatch}
        />
        <CardBillingDetail
          modalVisible={cardBillingDetailVisible}
          loading={billingLoading}
          handleModalVisible={this.handleCardBillingDetailVisible}
          data={billingDetailList}
          dispatch={dispatch}
        />
      </PageHeaderWrapper>
    );
  }
}

export default registrationList;
