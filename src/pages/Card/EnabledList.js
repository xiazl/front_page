import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, message, Modal } from 'antd';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateModal from '@/pages/Card/Modals/CreateModal';
import UpdateModal from '@/pages/Card/Modals/UpdateModal';
import DisableModal from '@/pages/Card/Modals/DisableModal';
import ImportModal from '@/pages/Card/Modals/ImportModal';
import ImportDelModal from '@/pages/Card/Modals/ImportDelModal';
import SpecialItemSetting from '@/pages/Card/Modals/SpecialItemSetting';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ card, loading }) => ({
  card,
  loading: loading.models.card,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    disableModalVisible: false,
    importModalVisible: false,
    importDelModalVisible: false,
    specialItemSettingVisible: false,
    expandForm: false,
    selectedRows: [],
    conditions: {},
    pagination: {
      current: 1,
      pageSize: 200, // 应特殊用户特别要求，默认改为200
    },
  };

  columns = [
    {
      title: '项目',
      dataIndex: 'operatorProject',
      width: 70,
    },
    {
      title: '序号',
      dataIndex: 'id',
      sorter: true,
      width: 70,
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      width: 50,
    },
    {
      title: '户名',
      dataIndex: 'owner',
      width: 60,
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      width: 120,
    },
    {
      title: '开户省',
      dataIndex: 'province',
      width: 60,
    },
    {
      title: '开户市',
      dataIndex: 'city',
      width: 60,
    },
    {
      title: '开户行',
      dataIndex: 'branchName',
      width: 100,
    },
    {
      title: '组员',
      dataIndex: 'operatorNickName',
      width: 60,
    },
    {
      title: '小组',
      dataIndex: 'operatorTeam',
      width: 60,
    },
    {
      title: '出卡次数',
      dataIndex: 'depositCount',
      sorter: true,
      width: 80,
    },
    {
      title: '出卡金额',
      dataIndex: 'depositAmount',
      sorter: true,
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTimeStr',
      width: 100,
    },
  ];

  componentDidMount() {
    this.fetchData();
  }

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
    this.setState(
      {
        conditions: {},
      },
      this.fetchData
    );
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

      this.setState(
        {
          conditions: fieldsValue,
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
      type: 'card/fetch',
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
  handleCreateModalVisible = flag => this.setState({ createModalVisible: !!flag });

  // 控制编辑弹框可见性
  handleUpdateModalVisible = flag => this.setState({ updateModalVisible: !!flag });

  // 控制停用弹框可见性
  handleDisableModalVisible = flag => this.setState({ disableModalVisible: !!flag });

  // 控制导入弹框可见性
  handleImportModalVisible = flag => this.setState({ importModalVisible: !!flag });

  // 控制导入删除弹框可见性
  handleImportDelModalVisible = flag => this.setState({ importDelModalVisible: !!flag });

  // 控制专用项目设置弹框可见性
  handleSpecialItemSettingVisible = flag => this.setState({ specialItemSettingVisible: !!flag });

  // 获取专用项目列表
  getProjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/getProjectList',
    });
  };

  // 打开专用项目设置弹框
  openSettingModal = () => {
    this.handleSpecialItemSettingVisible(true);
    this.getProjectList();
  };

  // 新增
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/add',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('新建成功');
          this.handleCreateModalVisible();
          this.fetchData();
        }
      },
    });
  };

  // 编辑
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/update',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('编辑成功');
          this.handleUpdateModalVisible();
          this.fetchData();
        }
      },
    });
  };

  // 停用
  handleDisable = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/disable',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('停用成功');
          this.handleDisableModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  exportExcel = () => {
    const condition = { isDisable: 0 };
    window.open(`/api/card/exportCardList?${stringify(condition)}`, '_blank');
  };

  // 清空选择行
  clearSelectedRows = () => {
    this.setState({ selectedRows: [] });
  };

  renderClearAmountContent = data => (
    <Fragment>
      <p>请注意：</p>
      <p>
        系统检测到今日已经执行过 <span className={styles.numHighlight}>{data || 0}</span> 次重置操作
      </p>
      <p>此操作将会重置所有卡片的【今日入账】和【今日出账】数据</p>
    </Fragment>
  );

  // 重置今日数据
  clearAmount = () => {
    const { dispatch } = this.props;
    const confirmModal = Modal.confirm({
      width: 520,
      confirmLoading: true,
      title: '确定要重置今日数据？',
      content: this.renderClearAmountContent(),
      onOk: () => {
        dispatch({
          type: 'card/clearAmount',
          callback: response => {
            if (response.success) {
              message.success('重置今日数据成功');
            }
          },
        });
      },
    });

    dispatch({
      type: 'card/getCleartips',
      callback: response => {
        if (response.success) {
          confirmModal.update({
            content: this.renderClearAmountContent(response.data),
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
    const { expandForm } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="项目">
              {getFieldDecorator('operatorProject')(<Input placeholder="请输入项目" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="序号">
              {getFieldDecorator('id')(<Input placeholder="请输入序号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="卡号">
              {getFieldDecorator('cardNo')(<Input placeholder="请输入卡号" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Col md={6} sm={24}>
              <FormItem label="组员">
                {getFieldDecorator('operatorNickName')(<Input placeholder="请输入组员昵称" />)}
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
              <FormItem label="银行">
                {getFieldDecorator('bankName')(<Input placeholder="请输入银行" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="小组">
                {getFieldDecorator('operatorTeam')(<Input placeholder="请输入小组" />)}
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
      card: { data, projectList },
      loading,
    } = this.props;
    const {
      selectedRows,
      createModalVisible,
      updateModalVisible,
      disableModalVisible,
      importModalVisible,
      importDelModalVisible,
      specialItemSettingVisible,
    } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleCreateModalVisible(true)}
              >
                新建
              </Button>
              <Button
                icon="edit"
                type="primary"
                disabled={selectedRows.length !== 1}
                onClick={() => this.handleUpdateModalVisible(true)}
              >
                编辑
              </Button>
              <Button
                icon="lock"
                type="primary"
                disabled={selectedRows.length === 0}
                onClick={() => this.handleDisableModalVisible(true)}
              >
                停用/冻结
              </Button>
              <Button icon="upload" onClick={() => this.handleImportModalVisible(true)}>
                导入卡片
              </Button>
              <Button icon="upload" onClick={() => this.handleImportDelModalVisible(true)}>
                导入删除
              </Button>
              <div className={styles.floatRight}>
                <Button icon="setting" onClick={this.openSettingModal}>
                  专用项目设置
                </Button>
                <Button icon="rollback" onClick={this.clearAmount}>
                  重置今日数据
                </Button>
                <Button icon="download" onClick={this.exportExcel}>
                  导出Excel
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
              scroll={{ y: 650 }}
            />
          </div>
        </Card>
        <CreateModal
          modalVisible={createModalVisible}
          loading={loading}
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleCreateModalVisible}
        />
        <UpdateModal
          modalVisible={updateModalVisible}
          loading={loading}
          handleUpdate={this.handleUpdate}
          handleModalVisible={this.handleUpdateModalVisible}
          card={selectedRows[0]}
        />
        <DisableModal
          modalVisible={disableModalVisible}
          loading={loading}
          handleDisable={this.handleDisable}
          handleModalVisible={this.handleDisableModalVisible}
          cards={selectedRows}
        />
        <ImportModal
          modalVisible={importModalVisible}
          loading={loading}
          handleModalVisible={this.handleImportModalVisible}
        />
        <ImportDelModal
          modalVisible={importDelModalVisible}
          loading={loading}
          handleModalVisible={this.handleImportDelModalVisible}
        />
        <SpecialItemSetting
          modalVisible={specialItemSettingVisible}
          loading={loading}
          handleModalVisible={this.handleSpecialItemSettingVisible}
          data={projectList}
          getProjectList={this.getProjectList}
          dispatch={dispatch}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
