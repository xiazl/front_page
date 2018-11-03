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
  DatePicker,
  Switch,
  message,
  Modal,
  Select,
} from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { defaultPagination, authority } from '@/constant';
import EditShouldAmountModal from './Modals/EditShouldAmountModal';
import ImportShouldAmountModal from './Modals/ImportShouldAmountModal';
import ExamineTaskModal from './Modals/ExamineTaskModal';
import Authorized from '@/utils/Authorized';
import { checkAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ showTask, global, loading }) => ({
  showTask,
  loading: loading.models.showTask,
  editAmountShouldLoading: loading.effects['showTask/editAmountShould'],
  examineTaskModalLoadings: {
    queryMatchedRecordLoading: loading.effects['showTask/queryMatchedRecord'],
    queryNotMatchedRecordLoading: loading.effects['showTask/queryNotMatchedRecord'],
    bundlingLoading: loading.effects['showTask/bundling'],
    removeBundlingLoading: loading.effects['showTask/removeBundling'],
    setExtraDepositLoading: loading.effects['showTask/setExtraDeposit'],
  },
  openOrClosedAutoMatchLoading: loading.effects['showTask/openOrClosedAutoMatchLoading'],
  webSocketServerInfo: global.webSocketServerInfo,
}))
@Form.create()
class showTaskList extends PureComponent {
  state = {
    curDay: moment().endOf(),
    expandForm: false,
    editShouldAmountModalVisible: false,
    importShouldAmountModalVisible: false,
    examineTaskModalVisible: false,
    examineTaskModalKey: 1,
    selectedRows: [],
    selectedRowKeys: [],
    conditions: {},
    pagination: {
      current: 1,
      pageSize: defaultPagination.pageSize,
    },
    websocketList: [],
    autoMatch: {
      status: 0,
    },
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
      sorter: true,
    },
    {
      title: '批次名',
      dataIndex: 'batchName',
      width: 100,
      fixed: 'left',
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      width: 150,
      fixed: 'left',
    },
    {
      title: '预计',
      dataIndex: 'amountPlan',
      width: 80,
      fixed: 'left',
    },
    {
      title: '应收',
      dataIndex: 'amountShould',
      width: 80,
      fixed: 'left',
    },
    {
      title: '审计',
      dataIndex: 'amountReal',
      width: 80,
      fixed: 'left',
    },
    {
      title: '未匹配',
      dataIndex: 'amountUnlink',
      width: 80,
      fixed: 'left',
      sorter: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: text => {
        if (text === 0) {
          return '金额出卡';
        }
        if (text === 1) {
          return '数量出卡';
        }
        if (text === 2) {
          return '卡号出卡';
        }
        return '未知';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'taskTimeStr',
      width: 180,
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      width: 100,
    },
    {
      title: '持卡人',
      dataIndex: 'owner',
      width: 100,
    },

    {
      title: '省',
      dataIndex: 'province',
      width: 100,
    },
    {
      title: '市',
      dataIndex: 'city',
      width: 100,
    },
    {
      title: '行',
      dataIndex: 'branchName',
    },

    {
      title: '小组',
      dataIndex: 'userTeam',
      width: 100,
    },
    {
      title: '组员',
      dataIndex: 'nickName',
      width: 100,
    },
    {
      title: '审计流程',
      dataIndex: 'audit',
      width: 80,
      fixed: 'right',
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
    } else {
      this.fetchCurDay();
    }
    if (checkAuthority([authority.superadmin, authority.admin, authority.auditor])) {
      const { webSocketServerInfo, dispatch } = this.props;
      if (!webSocketServerInfo) {
        dispatch({
          type: 'showTask/getWebSocketServerInfo',
          callback: response => {
            if (response.success) {
              this.createWebSocket(response.data);
            }
          },
        });
      } else {
        this.createWebSocket(webSocketServerInfo);
      }
    }
  }

  componentWillUnmount() {
    const { websocketList } = this.state;
    websocketList.forEach(websocket => websocket.close());
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

  /** 创建WebSocket连接 */
  createWebSocket = webSocketServerInfo => {
    const { ips, port, basePath } = webSocketServerInfo;

    const websocketList = [];
    if ('WebSocket' in window) {
      ips.forEach(ip => {
        const websocket = new ReconnectingWebSocket(`ws://${ip}:${port}${basePath}/ws/autoMatch`);
        websocket.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            this.setState({ autoMatch: data });
          } catch {
            console.error('WebSocket_onmessage-error:', event.data);
          }
        };

        websocketList.push(websocket);
      });
    } else {
      message.error('当前浏览器不支持WebSocket，请使用Chrome等高级浏览器', 10);
      return;
    }

    this.setState({ websocketList });
  };

  /** 打开或关闭自动审计 */
  openOrClosedAutoMatch = checked => {
    Modal.confirm({
      title: `确定要${checked ? '打开' : '关闭'}自动审计？`,
      onOk: () => {
        this.props.dispatch({
          type: 'showTask/openOrClosedAutoMatch',
          payload: { status: checked ? '1' : '0' },
        });
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
        () => this.fetchData({ current: 1 }, true)
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
      const startTime = dateRange[0].format('YYYY-MM-DD');
      const stopTime = dateRange[1].format('YYYY-MM-DD');

      this.setState(
        {
          conditions: { ...rest, startTime, stopTime },
        },
        () => this.fetchData({ current: 1 }, true)
      );
    });
  };

  // 获取列表数据
  fetchData = (params = {}, clearSelectedRows) => {
    const { conditions, pagination } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'showTask/fetch',
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
          if (clearSelectedRows) {
            this.clearSelectedRows();
          }
        }
      },
    });
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
  };

  /** 控制编辑应收弹框显示 */
  handleEditShouldAmountModalVisible = flag =>
    this.setState({ editShouldAmountModalVisible: !!flag });

  /** 控制导入应收金额弹框显示 */
  handleImportShouldAmountModalVisible = flag =>
    this.setState({ importShouldAmountModalVisible: !!flag });

  /** 控制审计任务弹框显示 */
  handleExamineTaskModalVisible = flag => this.setState({ examineTaskModalVisible: !!flag });

  /** 检查选中的数据是否包含非法数据 */
  checkSelectedRows = (suffix, checkArchived, checkExamined, checkAudited) => {
    const { selectedRows } = this.state;
    let archivedMsgPrefix = '数据已归档';
    let examinedMsaPrefix = '任务已审批';
    let auditedMsaPrefix = '任务已审计';
    if (selectedRows.length > 1) {
      archivedMsgPrefix = '包含归档数据';
      examinedMsaPrefix = '包含已审批任务';
      auditedMsaPrefix = '包含已审计任务';
    }

    for (let i = 0; i < selectedRows.length; i++) {
      const record = selectedRows[i];
      if (checkArchived && record.isArchive === 1) {
        message.error(`${archivedMsgPrefix}，${suffix}`);
        return true;
      }

      if (checkExamined && record.status === '已审批') {
        message.error(`${examinedMsaPrefix}，${suffix}`);
        return true;
      }

      if (checkAudited && record.amountReal !== 0) {
        message.error(`${auditedMsaPrefix}，${suffix}`);
        return true;
      }
    }

    return false;
  };

  /** 更换卡片 */
  changeCard = () => {
    // check selectedRows
    if (this.checkSelectedRows('无法更换卡片', true, true, true)) {
      return;
    }

    const { selectedRowKeys } = this.state;

    Modal.confirm({
      title: '是否确定更换卡片？',
      onOk: () => {
        this.props.dispatch({
          type: 'showTask/changeCard',
          payload: { ids: selectedRowKeys, cardAmount: selectedRowKeys.length },
          callback: response => {
            if (response.success) {
              message.success(response.message);
              this.clearSelectedRows();
              this.fetchData();
            }
          },
        });
      },
    });
  };

  /** 移除卡片 */
  removeCard = () => {
    // check selectedRows
    if (this.checkSelectedRows('，无法移除卡片', true, true, true)) {
      return;
    }

    const { selectedRowKeys } = this.state;

    Modal.confirm({
      title: '是否确定移除卡片？',
      onOk: () => {
        this.props.dispatch({
          type: 'showTask/removeCard',
          payload: { ids: selectedRowKeys },
          callback: response => {
            if (response.success) {
              message.success(response.message);
              this.clearSelectedRows();
              this.fetchData();
            }
          },
        });
      },
    });
  };

  /** 打开编辑应收弹框 */
  openEditAmountShouldModal = () => {
    // check selectedRows
    if (this.checkSelectedRows('，无法编辑应收', true, false, false)) {
      return;
    }

    this.handleEditShouldAmountModalVisible(true);
  };

  /** 编辑应收 */
  editAmountShould = params => {
    this.props.dispatch({
      type: 'showTask/editAmountShould',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success(response.message);
          this.clearSelectedRows();
          this.handleEditShouldAmountModalVisible();
          this.fetchData();
        }
      },
    });
  };

  /** 打开审计任务弹框 */
  openExamineTaskModal = () => {
    if (this.checkSelectedRows('无法执行审计', true, false, false)) {
      return;
    }

    const { examineTaskModalKey } = this.state;
    this.setState({
      examineTaskModalKey: examineTaskModalKey + 1,
      examineTaskModalVisible: true,
    });
  };

  /** 导出应收金额模版 */
  exportShouldAmountExcel = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      // 将dateRange对象处理为开始结束时间
      const { dateRange, ...rest } = fieldsValue;
      const startTime = dateRange[0].format('YYYY-MM-DD');
      const stopTime = dateRange[1].format('YYYY-MM-DD');

      window.open(
        `/api/task/exportImportTemplate?${stringify({ ...rest, startTime, stopTime })}`,
        '_blank'
      );
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
        <Row gutter={{ md: 6, lg: 16, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('dateRange', {
                initialValue: [moment(curDay), moment(curDay)],
                rules: [{ required: true, message: '请选择日期' }],
              })(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="批次">
              {getFieldDecorator('batchName')(<Input placeholder="请输入批次名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('taskType')(
                <Select placeholder="请选择出卡类型" allowClear style={{ width: '100%' }}>
                  <Option value="0">金额出卡</Option>
                  <Option value="1">数量出卡</Option>
                  <Option value="2">卡号出卡</Option>
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
          <Row gutter={{ md: 6, lg: 16, xl: 24 }}>
            <Col md={6} sm={24}>
              <FormItem label="序号">
                {getFieldDecorator('taskId')(<Input placeholder="请输入序号" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="小组">
                {getFieldDecorator('userTeam')(<Input placeholder="请输入小组" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="组员">
                {getFieldDecorator('nickName')(<Input placeholder="请输入组员昵称" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="审计流程">
                {getFieldDecorator('auditStatus')(
                  <Select style={{ width: '100%' }} allowClear placeholder="请选择审计流程">
                    <Option value="0">未匹配</Option>
                    <Option value="1">已匹配</Option>
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
      showTask: { data },
      loading,
      editAmountShouldLoading,
      dispatch,
      examineTaskModalLoadings,
      openOrClosedAutoMatchLoading,
    } = this.props;
    const {
      selectedRows,
      selectedRowKeys,
      editShouldAmountModalVisible,
      importShouldAmountModalVisible,
      examineTaskModalVisible,
      examineTaskModalKey,
      autoMatch,
    } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized
                authority={[authority.superadmin, authority.admin, authority.cardmanager]}
              >
                <Button
                  icon="swap"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={this.changeCard}
                >
                  更换卡片
                </Button>
                <Button
                  icon="delete"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={this.removeCard}
                >
                  移除卡片
                </Button>
              </Authorized>
              <Authorized authority={[authority.superadmin, authority.admin, authority.auditor]}>
                <Button
                  icon="edit"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={this.openEditAmountShouldModal}
                >
                  编辑应收
                </Button>
                <Button
                  icon="check"
                  type="primary"
                  disabled={selectedRows.length !== 1}
                  onClick={() => this.openExamineTaskModal()}
                >
                  审计任务
                </Button>
                <span>
                  自动审计
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={autoMatch.status > 0}
                    onChange={this.openOrClosedAutoMatch}
                    loading={openOrClosedAutoMatchLoading}
                  />
                  &nbsp;&nbsp;
                  {autoMatch.status === 1 && (
                    <span>
                      预计在
                      <span style={{ color: 'red', fontSize: '1.3em' }}>{autoMatch.message}</span>
                      开始
                    </span>
                  )}
                  {autoMatch.status === 2 && <span>自动审计中...</span>}
                  {autoMatch.status === 3 && <span>自动审计结束</span>}
                </span>
                <div className={styles.floatRight}>
                  <Button icon="download" onClick={this.exportShouldAmountExcel}>
                    导出应收模版
                  </Button>
                  <Button
                    icon="upload"
                    onClick={() => this.handleImportShouldAmountModalVisible(true)}
                  >
                    导入应收金额
                  </Button>
                </div>
              </Authorized>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1800, y: 630 }}
            />
          </div>
        </Card>
        <EditShouldAmountModal
          visible={editShouldAmountModalVisible}
          handleModalVisible={this.handleEditShouldAmountModalVisible}
          editAmountShould={this.editAmountShould}
          rowKeys={selectedRowKeys}
          rows={selectedRows}
          loading={editAmountShouldLoading}
        />
        <ImportShouldAmountModal
          visible={importShouldAmountModalVisible}
          loading={loading}
          handleModalVisible={this.handleImportShouldAmountModalVisible}
        />
        <ExamineTaskModal
          key={examineTaskModalKey}
          visible={examineTaskModalVisible}
          dispatch={dispatch}
          task={selectedRows[0] || {}}
          onCancel={this.handleExamineTaskModalVisible}
          refreshShowTaskList={this.fetchData}
          clearSelectedRows={this.clearSelectedRows}
          {...examineTaskModalLoadings}
        />
      </PageHeaderWrapper>
    );
  }
}

export default showTaskList;
