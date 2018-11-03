import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Divider } from 'antd';
import CountDown from '@/components/CountDown';
import numeral from 'numeral';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './index.less';

@connect(({ balanceStatistic: { teamStatistics }, loading }) => ({
  teamStatistics,
  loading: loading.effects['balanceStatistic/queryTeamStatistics'],
}))
class BalanceStatistic extends Component {
  state = {
    targetTime: new Date().getTime() + 300000,
  };

  componentDidMount() {
    this.reqRef = requestAnimationFrame(this.fetchData);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  fetchData = () => {
    const { dispatch } = this.props;
    this.setState({ targetTime: new Date().getTime() + 300000 });
    dispatch({
      type: 'balanceStatistic/queryTeamStatistics',
    });
  };

  pageHeaderContent = () => {
    const { targetTime } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.fetchData}>
          立即刷新
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <CountDown style={{ fontSize: 20 }} target={targetTime} onEnd={this.fetchData} /> 后自动刷新
      </div>
    );
  };

  render() {
    const { teamStatistics, loading } = this.props;

    return (
      <PageHeaderWrapper content={this.pageHeaderContent()}>
        <Row gutter={16}>
          <Col xl={4} lg={8} md={12} sm={24} xs={24}>
            <Card loading={loading} bordered={false} title="预估应收" bodyStyle={{ padding: 12 }}>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {teamStatistics.map((group, i) => {
                    const arr = [];
                    if (i > 0) {
                      arr.push(<Divider />);
                    }

                    group.forEach(item => {
                      arr.push(
                        <li key={item.teamName}>
                          <span className={styles.rankingItemTitle} title={item.teamName}>
                            {item.teamName}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.planAmount).format('0,0[.][000000]')}
                          </span>
                        </li>
                      );
                    });

                    return arr;
                  })}
                </ul>
              </div>
            </Card>
          </Col>
          <Col xl={5} lg={8} md={12} sm={24} xs={24}>
            <Card loading={loading} bordered={false} title="应收金额" bodyStyle={{ padding: 12 }}>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {teamStatistics.map((group, i) => {
                    const arr = [];
                    if (i > 0) {
                      arr.push(<Divider />);
                    }

                    group.forEach(item => {
                      arr.push(
                        <li key={item.teamName}>
                          <span className={styles.rankingItemTitle} title={item.teamName}>
                            {item.teamName}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.shouldAmount).format('0,0[.][000000]')}
                          </span>
                        </li>
                      );
                    });

                    return arr;
                  })}
                </ul>
              </div>
            </Card>
          </Col>
          <Col xl={5} lg={8} md={12} sm={24} xs={24}>
            <Card loading={loading} bordered={false} title="总收金额" bodyStyle={{ padding: 12 }}>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {teamStatistics.map((group, i) => {
                    const arr = [];
                    if (i > 0) {
                      arr.push(<Divider />);
                    }

                    group.forEach(item => {
                      arr.push(
                        <li key={item.teamName}>
                          <span className={styles.rankingItemTitle} title={item.teamName}>
                            {item.teamName}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.inAmount).format('0,0[.][000000]')}
                          </span>
                        </li>
                      );
                    });

                    return arr;
                  })}
                </ul>
              </div>
            </Card>
          </Col>
          <Col xl={5} lg={8} md={12} sm={24} xs={24}>
            <Card loading={loading} bordered={false} title="总支金额" bodyStyle={{ padding: 12 }}>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {teamStatistics.map((group, i) => {
                    const arr = [];
                    if (i > 0) {
                      arr.push(<Divider />);
                    }

                    group.forEach(item => {
                      arr.push(
                        <li key={item.teamName}>
                          <span className={styles.rankingItemTitle} title={item.teamName}>
                            {item.teamName}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.outAmount).format('0,0[.][000000]')}
                          </span>
                        </li>
                      );
                    });

                    return arr;
                  })}
                </ul>
              </div>
            </Card>
          </Col>
          <Col xl={5} lg={8} md={12} sm={24} xs={24}>
            <Card loading={loading} bordered={false} title="总入-总出" bodyStyle={{ padding: 12 }}>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {teamStatistics.map((group, i) => {
                    const arr = [];
                    if (i > 0) {
                      arr.push(<Divider />);
                    }

                    group.forEach(item => {
                      arr.push(
                        <li key={item.teamName}>
                          <span className={styles.rankingItemTitle} title={item.teamName}>
                            {item.teamName}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.diffInOut).format('0,0[.][000000]')}
                          </span>
                        </li>
                      );
                    });

                    return arr;
                  })}
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default BalanceStatistic;
