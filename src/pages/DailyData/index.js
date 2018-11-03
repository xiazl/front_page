import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { stringify } from 'qs';
import { Row, Col, DatePicker, Button, message } from 'antd';
import { ChartCard } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './index.less';

@connect(({ global, dailyData, loading }) => ({
  curDay: global.curDay,
  dailyData,
  curDayLoading: loading.effects['global/fetchCurDay'],
  dataLoading: loading.effects['global/fetchCurDay'] || loading.effects['dailyData/fetch'],
}))
class DailyData extends Component {
  state = {
    date: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchCurDay',
      callback: response => {
        if (response.success) {
          this.setState({ date: response.data }, this.fetchDailyData);
        }
      },
    });
  }

  fetchDailyData = () => {
    const { date } = this.state;
    if (!date) {
      message.error('请先选择日期');
      return;
    }
    const { dispatch } = this.props;
    const dateStr = moment(date).format('YYYY-MM-DD');
    dispatch({
      type: 'dailyData/fetch',
      payload: {
        startTime: dateStr,
        stopTime: dateStr,
      },
    });
  };

  handleDataChange = date => {
    if (!date) {
      this.setState({ date });
      return;
    }
    this.setState({ date: date.valueOf() }, this.fetchDailyData);
  };

  disabledDate = current => {
    const { curDay } = this.props;
    let maxDay;
    if (curDay) {
      maxDay = moment(curDay);
    } else {
      maxDay = moment();
    }

    return current && current > maxDay.endOf('day');
  };

  pageHeaderContent = () => (
    <div>
      <DatePicker
        defaultValue={moment(this.props.curDay)}
        onChange={this.handleDataChange}
        disabledDate={this.disabledDate}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="primary" onClick={this.fetchDailyData}>
        查询
      </Button>
    </div>
  );

  render() {
    const { curDayLoading, dataLoading, dailyData } = this.props;
    const { date } = this.state;
    const dateSearchParam = stringify({ date });

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <PageHeaderWrapper loading={curDayLoading} content={this.pageHeaderContent()}>
        <GridContent>
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="出卡项目数量"
                loading={dataLoading}
                total={`${numeral(dailyData.pCount).format('0,0[.][00]')}`}
                footer={<Link to={`/statistic/project?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="出卡批次数量"
                loading={dataLoading}
                total={`${numeral(dailyData.ptCount).format('0,0[.][00]')}`}
                footer={<Link to={`/statistic/batch?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="出卡卡次数量"
                loading={dataLoading}
                total={`${numeral(dailyData.cardTimeCount).format('0,0[.][00]')}`}
                footer={<Link to={`/statistic/task?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="预计回款(万)"
                loading={dataLoading}
                total={`¥ ${numeral(dailyData.planAmount).format('0,0[.][00]')}`}
                footer={<Link to={`/task/show-task?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="应收回款(万)"
                loading={dataLoading}
                total={`¥ ${numeral(dailyData.shouldAmount).format('0,0[.][00]')}`}
                footer={<Link to={`/task/show-task?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="实际回款(万)"
                loading={dataLoading}
                total={`¥ ${numeral(dailyData.realAmount).format('0,0[.][00]')}`}
                footer={<Link to={`/task/show-task?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="未匹配金额(万)"
                loading={dataLoading}
                total={`¥ ${numeral(dailyData.unbindAmount).format('0,0[.][00]')}`}
                footer={<Link to={`/task/deposit?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="额外入账(万)"
                loading={dataLoading}
                total={`¥ ${numeral(dailyData.extraAmount).format('0,0[.][00]')}`}
                footer={<Link to={`/task/deposit?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="出账金额"
                loading={dataLoading}
                footer={<Link to={`/task/billing?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              >
                <Trend>
                  总计金额
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.withdrawAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
                <br />
                <Trend>
                  审计通过
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.auditWithdrawAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="支付宝出款"
                loading={dataLoading}
                footer={<Link to={`/task/billing?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              >
                <Trend>
                  总计金额
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.withdrawZfbAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
                <br />
                <Trend>
                  审计通过
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.auditWithdrawZfbAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="兑换出款"
                loading={dataLoading}
                footer={<Link to={`/task/billing?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              >
                <Trend>
                  总计金额
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.withdrawDhAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
                <br />
                <Trend>
                  审计通过
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.auditWithdrawDhAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="开支出款"
                loading={dataLoading}
                footer={<Link to={`/task/billing?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              >
                <Trend>
                  总计金额
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.withdrawKzAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
                <br />
                <Trend>
                  审计通过
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.auditWithdrawKzAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
              </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="冻结出款"
                loading={dataLoading}
                footer={<Link to={`/task/billing?${dateSearchParam}`}>查看详情</Link>}
                contentHeight={46}
              >
                <Trend>
                  总计金额
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.withdrawDjAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
                <br />
                <Trend>
                  审计通过
                  <span className={styles.trendText}>
                    {`¥ ${numeral(dailyData.auditWithdrawDjAmount).format('0,0[.][00]')}`}
                  </span>
                </Trend>
              </ChartCard>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default DailyData;
