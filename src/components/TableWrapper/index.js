import React, { PureComponent } from 'react';
import { Table } from 'antd';

export default class TableWrapper extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
        selectedRows: [],
      };
    }
    return null;
  }

  selectRow = record => {
    const { selectedRowKeys, selectedRows } = this.state;
    const { rowKey } = this.props;

    const index = selectedRowKeys.indexOf(record[rowKey]);
    if (index >= 0) {
      selectedRowKeys.splice(index, 1);
      const rowsIndex = selectedRows.findIndex(item => item[rowKey] === record[rowKey]);
      selectedRows.splice(rowsIndex, 1);
    } else {
      selectedRowKeys.push(record[rowKey]);
      selectedRows.push(record);
    }

    this.setSelectedRowsAndKeys([...selectedRowKeys], [...selectedRows]);
  };

  setSelectedRowsAndKeys = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows, selectedRowKeys);
    }

    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const { rowKey, columns, dataSource, selectDisabled, ...rest } = this.props;
    const { selectedRowKeys } = this.state;
    let { rowSelection, onRow } = this.props;

    if (selectDisabled) {
      rowSelection = null;
      onRow = null;
    } else {
      rowSelection = {
        selectedRowKeys,
        onChange: this.setSelectedRowsAndKeys,
        ...rowSelection,
      };

      onRow = record => ({
        onClick: () => this.selectRow(record),
      });
    }

    return (
      <Table
        {...rest}
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        onChange={this.onChange}
        rowSelection={rowSelection}
        onRow={onRow}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => `第${range[0]}-${range[1]}条记录，共${total}条`,
        }}
      />
    );
  }
}

TableWrapper.defaultProps = {
  rowKey: 'id',
  selectDisabled: false,
};
