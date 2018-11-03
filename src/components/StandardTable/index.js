import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';
import { defaultPagination } from '@/constant';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows, selectedRowKeys);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  changeRowSelect = (selected, records) => {
    const { rowKey } = this.props;
    let { selectedRows } = this.props;
    let { selectedRowKeys } = this.state;
    const rowKeys = records.map(item => item[rowKey]);
    if (selected) {
      selectedRowKeys = [...selectedRowKeys, ...rowKeys];
      selectedRows = [...selectedRows, ...records];
    } else {
      selectedRowKeys = selectedRowKeys.filter(item => !rowKeys.includes(item));
      selectedRows = selectedRows.filter(item => !rowKeys.includes(item[rowKey]));
    }

    this.handleRowSelectChange(selectedRowKeys, selectedRows);
  };

  handleRowSelect = (record, selected) => {
    this.changeRowSelect(selected, [record]);
  };

  handleRowSelectAll = (selected, selectedRows, changeRows) => {
    this.changeRowSelect(selected, changeRows);
  };

  selectRow = record => {
    const { selectedRowKeys } = this.state;
    const { rowKey } = this.props;
    const selected = !selectedRowKeys.includes(record[rowKey]);

    this.changeRowSelect(selected, [record]);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      selectDisabled,
      rowSelectDisabled,
      scroll,
    } = this.props;
    let { rowSelection, onRow } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `第${range[0]}-${range[1]}条记录，共${total}条`,
      ...defaultPagination,
      ...pagination,
    };

    if (selectDisabled) {
      rowSelection = null;
      onRow = null;
    } else {
      rowSelection = {
        selectedRowKeys,
        // onChange: this.handleRowSelectChange,
        onSelect: this.handleRowSelect,
        onSelectAll: this.handleRowSelectAll,
        ...rowSelection,
      };

      if (!rowSelectDisabled) {
        onRow = record => ({
          onClick: () => this.selectRow(record),
        });
      }
    }

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          {!selectDisabled && (
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          )}
        </div>
        <Table
          loading={loading}
          rowKey={rowKey}
          rowSelection={rowSelection}
          onRow={onRow}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={scroll}
        />
      </div>
    );
  }
}

StandardTable.defaultProps = {
  rowKey: 'id',
  selectedRows: [],
  selectDisabled: false, // 若为true，表格不能进行数据选择
  rowSelectDisabled: false, // 若为true，只能点击左侧的选择框才能选中数据
};

export default StandardTable;
