import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, message } from 'antd';
import { stringify } from 'qs';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EnableModal from '@/pages/Card/Modals/EnableModal';
import DeleteModal from '@/pages/Card/Modals/DeleteModal';
import UpdateReasonModal from '@/pages/Card/Modals/UpdateReasonModal';
import { authority } from '@/constant';
import Authorized from '@/utils/Authorized';

import styles from '@/pages/TableLayout.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ card, loading }) => ({
  card,
  loading: loading.models.card,
}))
@Form.create()
class DisabledList extends PureComponent {
  state = {
    enableModalVisible: false,
    deleteModalVisible: false,
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
      sorter: true,
      width: 60,
    },
    {
      title: '序号',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      sorter: true,
      width: 60,
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
      sorter: true,
      width: 60,
    },
    {
      title: '小组',
      dataIndex: 'operatorTeam',
      sorter: true,
      width: 60,
    },
    {
      title: '创建时间',
      dataIndex: 'createTimeStr',
      width: 120,
    },
    {
      title: '停用时间',
      dataIndex: 'disableTime',
      sorter: true,
      width: 120,
    },
    {
      title: '停用原因',
      dataIndex: 'disableReason',
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
      type: 'card/fetchDisabledCard',
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

  // 控制启用弹框可见性
  handleEnableModalVisible = flag => this.setState({ enableModalVisible: !!flag });

  // 控制删除弹框可见性
  handleDeleteModalVisible = flag => this.setState({ deleteModalVisible: !!flag });

  // 控制修改弹框可见性
  handleUpdateModalVisible = flag => this.setState({ updateModalVisible: !!flag });

  // 启用
  handleEnable = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/enableCard',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('启用成功');
          this.handleEnableModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  // 删除
  handleDelete = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/deleteCard',
      payload: fields,
      callback: response => {
        if (response.success) {
          form.resetFields();
          message.success('删除成功');
          this.handleDeleteModalVisible();
          this.clearSelectedRows();
          this.fetchData();
        }
      },
    });
  };

  // 修改停用原因
  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/updateReason',
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

  exportExcel = () => {
    const condition = { isDisable: 1 };
    window.open(`/api/card/exportCardList?${stringify(condition)}`, '_blank');
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
            <FormItem label="小组">
              {getFieldDecorator('operatorTeam')(<Input placeholder="请输入小组" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="组员">
              {getFieldDecorator('operatorNickName')(<Input placeholder="请输入组员昵称" />)}
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
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="银行">
                {getFieldDecorator('bankName')(<Input placeholder="请输入银行" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="序号">
                {getFieldDecorator('id')(<Input placeholder="请输入序号" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="停用原因">
                {getFieldDecorator('disableReason')(<Input placeholder="请输入停用原因" />)}
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
      card: { disabledData },
      loading,
    } = this.props;
    const { selectedRows, enableModalVisible, deleteModalVisible, updateModalVisible } = this.state;

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderConditionForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized
                authority={[authority.cardmanager, authority.admin, authority.superadmin]}
              >
                <Button
                  icon="undo"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={() => this.handleEnableModalVisible(true)}
                >
                  启用卡片
                </Button>
                <Button
                  icon="delete"
                  type="primary"
                  disabled={selectedRows.length === 0}
                  onClick={() => this.handleDeleteModalVisible(true)}
                >
                  删除卡片
                </Button>
                <Button
                  icon="edit"
                  type="primary"
                  disabled={selectedRows.length !== 1}
                  onClick={() => this.handleUpdateModalVisible(true)}
                >
                  修改停用原因
                </Button>
              </Authorized>
              <div className={styles.floatRight}>
                <Button icon="download" onClick={this.exportExcel}>
                  导出卡片
                </Button>
              </div>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={disabledData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ y: 650 }}
            />
          </div>
        </Card>
        <EnableModal
          modalVisible={enableModalVisible}
          loading={loading}
          handleEnable={this.handleEnable}
          handleModalVisible={this.handleEnableModalVisible}
          cards={selectedRows}
        />
        <DeleteModal
          modalVisible={deleteModalVisible}
          loading={loading}
          handleDelete={this.handleDelete}
          handleModalVisible={this.handleDeleteModalVisible}
          cards={selectedRows}
        />
        <UpdateReasonModal
          modalVisible={updateModalVisible}
          loading={loading}
          handleUpdate={this.handleUpdate}
          handleModalVisible={this.handleUpdateModalVisible}
          selectRows={selectedRows}
        />
      </PageHeaderWrapper>
    );
  }
}

export default DisabledList;
