import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default class RangePickerLimit extends PureComponent {
  state = {
    firstSelected: null,
  };

  disabledDate = currentDate => {
    const { firstSelected } = this.state;
    const { limit } = this.props;

    if (firstSelected) {
      return (
        currentDate &&
        (currentDate <
          firstSelected
            .clone()
            .subtract(limit, 'days')
            .endOf('day') ||
          currentDate >
            firstSelected
              .clone()
              .add(limit - 1, 'days')
              .endOf('day'))
      );
    }

    return false;
  };

  onCalendarChange = dates => {
    if (dates.length === 1) {
      this.setState({ firstSelected: dates[0] });
    } else {
      this.setState({ firstSelected: null });
    }
  };

  onOpenChange = () => {
    this.setState({ firstSelected: null });
  };

  render() {
    const { limit, ...rest } = this.props;

    return (
      <RangePicker
        {...rest}
        disabledDate={this.disabledDate}
        onCalendarChange={this.onCalendarChange}
        onOpenChange={this.onOpenChange}
      />
    );
  }
}

RangePickerLimit.defaultProps = {
  limit: 7,
};
