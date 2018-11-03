import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  message,
  DatePicker,
  Modal,
  Badge,
  Divider,
} from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AuditModal from '@/pages/Task/Billing/Modals/AuditModal';
import DisposeModal from '@/pages/Task/Billing/Modals/DisposeModal';
import UpdateModel from '@/pages/Task/Billing/Modals/UpdateModal';
import { defaultPagination, authority } from '@/constant';
import { checkAuthority } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import styles from '@/pages/TableLayout.less';
import { getPageQuery, getPageTimeEndQuery } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ billing, loading }) => ({
  billing,
  loading: loading.models.billing,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    const audit = [authority.auditor];
    const dispose = [authority.admin, authority.superadmin];
    const operator = [authority.operator];
    const teamleader = [authority.operator, authority.teamleader];
    let rowSelectDisabled = true;
    let fixWidth = 1950;
    if (checkAuthority(audit)) {
      rowSelectDisabled = false;
      fixWidth = 2050;
    } else if (checkAuthority(dispose)) {
      fixWidth = 2250;
    } else if (checkAuthority(teamleader)) {
      fixWidth = 2070;
    }

    this.state = {
      currentDayStart: moment().startOf(),
      currentDayEnd: moment().endOf(),
      auditModalVisible: false,
      disposeModalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      audit,
      operator,
      teamleader,
      fixWidth,
      rowSelectDisabled,
      dispose,
      selectedRows: [],
      selectedRowKeys: [],
      selectedRowData: {},
      auditStatus: [],
      disposeStatus: [],
      conditions: {},
      pagination: {
        current: 1,
        pageSize: defaultPagination.pageSize,
      },
    };
  }

  componentDidMount() {
    const { dateStart } = getPageQuery();
    const { dateEnd } = getPageTimeEndQuery();
    if (dateStart && dateEnd) {
      const currentDayStart = Number(dateStart);
      const currentDayEnd = Number(dateEnd);
      const curDateStart = moment(currentDayStart).format('YYYY-MM-DD HH:mm:ss');
      const curDateEnd = moment(currentDayEnd).format('YYYY-MM-DD HH:mm:ss');

      const { conditions } = this.state;
      this.setState(
        {
          currentDayStart,
          conditions: { ...conditions, startTime: curDateStart, stopTime: curDateEnd },
        },
        this.fetchData
      );
    } else {
      this.fetchCurrentDay();
    }

    this.selectAuditStatus();
    this.selectDisposeStatus();
  }

  displayColumn = () => {
    const { audit, dispose, operator, teamleader } = this.state;
    let columns = [
      {
        title: '组员',
        width: 80,
        dataIndex: 'operatorNickName',
        fixed: 'left',
      },
      {
        title: '卡号',
        width: 120,
        dataIndex: 'cardNo',
        fixed: 'left',
      },
      {
        title: '出账金额(万)',
        width: 80,
        dataIndex: 'amount',
        fixed: 'left',
        sorter: true,
      },
      {
        title: '序号',
        width: 80,
        dataIndex: 'id',
      },
      {
        title: '小组',
        width: 80,
        dataIndex: 'operatorTeam',
      },
      {
        title: '银行卡序号',
        width: 80,
        dataIndex: 'cardId',
      },
      {
        title: '银行',
        width: 80,
        dataIndex: 'bankName',
      },
      {
        title: '户名',
        width: 80,
        dataIndex: 'owner',
      },
      {
        title: '省',
        width: 80,
        dataIndex: 'province',
      },
      {
        title: '市',
        width: 80,
        dataIndex: 'city',
      },
      {
        title: '开户行',
        width: 120,
        dataIndex: 'branchName',
      },
      {
        title: '任务明细',
        width: 320,
        dataIndex: 'comment',
      },
      {
        title: '反馈',
        width: 320,
        dataIndex: 'feedback',
      },
      {
        title: '出账时间',
        width: 180,
        dataIndex: 'createTimeStr',
      },
      {
        title: '出账类型',
        width: 80,
        dataIndex: 'typeStr',
      },
    ];

    const auditColumn = [
      {
        title: '审计状态',
        width: 80,
        dataIndex: 'auditStatus',
        fixed: 'right',
        render: text => {
          if (text === 0) {
            return <Badge status="processing" text="审核中" />;
          }
          if (text === 1) {
            return <Badge status="success" text="审核通过" />;
          }
          if (text === -1) {
            return <Badge status="error" text="审核不通过" />;
          }
          return <Badge status="default" text="未审核" />;
        },
      },
      {
        title: '审计备注',
        width: 80,
        dataIndex: 'auditComment',
        fixed: 'right',
      },
    ];

    const disposeColumn = [
      {
        title: '处理状态',
        width: 80,
        dataIndex: 'disposeStatus',
        fixed: 'right',
        render: text => {
          if (text === 0) {
            return <Badge status="default" text="未处理" />;
          }
          if (text === 1) {
            return <Badge status="success" text="处理通过" />;
          }
          if (text === -1) {
            return <Badge status="error" text="处理不通过" />;
          }
          return '';
        },
      },
      {
        title: '处理备注',
        width: 80,
        dataIndex: 'disposeComment',
        fixed: 'right',
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
              <Icon type="edit" theme="outlined" title="修改" />
            </a>
          </Fragment>
        ),
      },
    ];

    const teamleaderColumn = [
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        render: record => (
          <Fragment>
            <a onClick={() => this.openUpdateModal(record)}>
              <Icon type="edit" theme="outlined" title="修改" />
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.deleteRecord(record)}>
              <Icon type="delete" theme="outlined" title="删除" />
            </a>
          </Fragment>
        ),
      },
    ];

    if (checkAuthority(audit)) {
      columns = columns.concat(auditColumn);
    } else if (checkAuthority(dispose)) {
      columns = columns.concat(auditColumn);
      columns = columns.concat(disposeColumn);
    } else if (checkAuthority(operator)) {
      columns = columns.concat(operateColumn);
    } else if (checkAuthority(teamleader)) {
      columns = columns.concat(teamleaderColumn);
    }

    return columns;
  };

  // 从后台获取当天业务日期
  fetchCurrentDay = () => {
    const { conditions } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'global/fetchCurTime',
      callback: response => {
        let currentDayStart = moment().startOf('day');
        let currentDayEnd = moment().endOf('day');

        if (response.success) {
          currentDayStart = response.data[0];
          currentDayEnd = response.data[1];
        }

        const curDateStart = moment(currentDayStart).format('YYYY-MM-DD HH:mm:ss');
        const curDateEnd = moment(currentDayEnd).format('YYYY-MM-DD HH:mm:ss');

        this.setState(
          {
            currentDayStart,
            currentDayEnd,
            conditions: { ...conditions, startTime: curDateStart, stopTime: curDateEnd },
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
      const startTime = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
      const stopTime = dateRange[1].format('YYYY-MM-DD HH:mm:ss');

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
  handleSelectRows = (rows, rowKeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowKeys,
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
      const startTime = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
      const stopTime = dateRange[1].format('YYYY-MM-DD HH:mm:ss');

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
      type: 'billing/fetch',
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

  // 控制新增弹框可见性
  handleAuditModalVisible = flag => this.setState({ auditModalVisible: !!flag });

  // 控制编辑弹框可见性
  handleDisposeModalVisible = flag => this.setState({ disposeModalVisible: !!flag });

  // 控制修改弹框可见性
  handleUpdateModalVisible = flag => this.setState({ updateModalVisible: !!flag });

  openAuditModal = () => {
    this.handleAuditModalVisible(true);
  };

  openDisposeModal = () => {
    this.handleDisposeModalVisible(true);
  };

  openUpdateModal = record => {
    this.handleUpdateModalVisible(true);
    this.setState({
      selectedRowData: record,
    });
  };

  selectAuditStatus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billing/listAuditStatus',
      callback: response => {
        if (response.success) {
          this.setState({
            auditStatus: response.data,
          });
        }
      },
    });
  };

  selectDisposeStatus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billing/listDisposeStatus',
      callback: response => {
        if (response.success) {
          this.setState({
            disposeStatus: response.data,
          });
        }
      },
    });
  };

  // 审计
  handleAudit = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billing/audit',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('审计成功');
          this.handleAuditModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  // 处理
  handleDispose = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billing/dispose',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('处理成功');
          this.handleDisposeModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  // 修改记录
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'billing/update',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('修改成功');
          this.handleUpdateModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
    this.setState({ selectedRowKeys: [] });
  };

  deleteRecord = record => {
    if (record.isArchive === 1) {
      message.warn('包含归档数据，无法删除！');
      return;
    }
    if (record.auditStatus != null && record.auditStatus === 1) {
      message.warn('包含审计通过数据，无法删除出！');
      return;
    }
    this.deleteRecords(record);
  };

  // 删除
  deleteRecords = record => {
    const { dispatch } = this.props;
    const { selectedRows, selectedRowKeys } = this.state;
    let ids;
    if (record.id) {
      ids = [record.id];
    } else {
      for (let i = 0; i < selectedRows.length; i++) {
        if (selectedRows[i].isArchive === 1) {
          message.warn('包含归档数据，无法删除！');
          return;
        }
        if (selectedRows[i].auditStatus != null && selectedRows[i].auditStatus === 1) {
          message.warn('包含审计通过数据，无法删除出！');
          return;
        }
      }
    }

    Modal.confirm({
      title: '确定要删除？',
      content: '',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'billing/delete',
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

  // 导出
  exportExcel = () => {
    const { conditions } = this.state;
    window.open(`/api/billing/exportBillingDetail?${stringify(conditions)}`, '_blank');
  };

  // 渲染查询条件表单
  renderConditionForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { currentDayStart, currentDayEnd, expandForm } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('dateRange', {
                initialValue: [moment(currentDayStart), moment(currentDayEnd)],
                rules: [{ required: true, message: '请选择日期' }],
              })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="序号">
              {getFieldDecorator('id')(<Input placeholder="请输入序号" />)}
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
        {expandForm && [
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="组员">
                {getFieldDecorator('operatorNickName')(<Input placeholder="请输入组员昵称" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="小组">
                {getFieldDecorator('operatorTeam')(<Input placeholder="请输入组员所属小组" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="审计状态">
                {getFieldDecorator('auditStatus')(
                  <Select style={{ width: '100%' }} placeholder="请选择审计状态" allowClear>
                    {this.state.auditStatus.map(item => (
                      <Option key={item.key} value={`${item.key}`}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="处理状态">
                {getFieldDecorator('disposeStatus')(
                  <Select style={{ width: '100%' }} placeholder="请选择处理状态" allowClear>
                    {this.state.disposeStatus.map(item => (
                      <Option key={item.key} value={`${item.key}`}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>,
        ]}
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
      billing: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      auditModalVisible,
      disposeModalVisible,
      updateModalVisible,
      fixWidth,
      rowSelectDisabled,
      selectedRowData,
    } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized authority={[authority.superadmin, authority.admin, authority.auditor]}>
                <Button
                  icon="check"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={this.openAuditModal}
                >
                  审计
                </Button>
                <Authorized authority={[authority.superadmin, authority.admin]}>
                  <Button
                    icon="check-circle"
                    type="primary"
                    disabled={selectedRows.length !== 1}
                    onClick={this.openDisposeModal}
                  >
                    处理
                  </Button>
                </Authorized>
              </Authorized>
              <Authorized authority={[authority.teamleader, authority.operator]}>
                <Authorized authority={[authority.teamleader]}>
                  <Button
                    icon="delete"
                    type="primary"
                    disabled={selectedRows.length === 0}
                    onClick={this.deleteRecords}
                  >
                    批量删除
                  </Button>
                </Authorized>
              </Authorized>
              <Authorized authority={[authority.auditor, authority.superadmin, authority.admin]}>
                <div className={styles.floatRight}>
                  <Button icon="download" onClick={this.exportExcel}>
                    导出Excel
                  </Button>
                </div>
              </Authorized>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowSelectDisabled={rowSelectDisabled}
              loading={loading}
              data={data}
              columns={this.displayColumn()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: fixWidth, y: 480 }}
            />
          </div>
        </Card>
        <AuditModal
          modalVisible={auditModalVisible}
          loading={loading}
          handleAudit={this.handleAudit}
          handleModalVisible={this.handleAuditModalVisible}
          selectRows={selectedRows}
        />
        <DisposeModal
          modalVisible={disposeModalVisible}
          loading={loading}
          handleDispose={this.handleDispose}
          handleModalVisible={this.handleDisposeModalVisible}
          selectRows={selectedRows}
        />
        <UpdateModel
          modalVisible={updateModalVisible}
          loading={loading}
          handleUpdate={this.handleUpdate}
          handleModalVisible={this.handleUpdateModalVisible}
          selectRows={selectedRowData}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
