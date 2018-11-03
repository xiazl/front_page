import React, { PureComponent } from 'react';
import { Select } from 'antd';

import style from './index.less';

const Option = Select.Option;

export default class SelectAll extends PureComponent {
  handleChange = value => {
    const { allOptionValue, children, onChange } = this.props;
    let newValue = value;
    if (value.includes(allOptionValue)) {
      newValue = children.map(option => option.props.value);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  render() {
    const { allOptionValue, onChange, children, ...rest } = this.props;

    return (
      <Select mode="multiple" allowClear onChange={this.handleChange} {...rest}>
        <Option className={style.selectAllOption} key={allOptionValue} value={allOptionValue}>
          -- 全选 --
        </Option>
        {children}
      </Select>
    );
  }
}

SelectAll.defaultProps = {
  allOptionValue: '-11',
};
