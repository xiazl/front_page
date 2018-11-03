import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button } from 'antd';
import { HorizontalBar } from '@/components/Charts';
import CountDown from '@/components/CountDown';
import numeral from 'numeral';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './index.less';

@connect(({ balanceStatistic, loading }) => ({
  balanceStatistic,
  queryTeamLoading: loading.effects['balanceStatistic/queryTeamBalance'],
  queryCardLoading: loading.effects['balanceStatistic/queryCardBalance'],
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
      type: 'balanceStatistic/queryTeamBalance',
    });

    dispatch({
      type: 'balanceStatistic/queryCardBalance',
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
    const { balanceStatistic, queryTeamLoading, queryCardLoading } = this.props;
    const { teamBalance, cardBalance } = balanceStatistic;

    return (
      <PageHeaderWrapper content={this.pageHeaderContent()}>
        <Card
          loading={queryTeamLoading}
          bordered={false}
          // bodyStyle={{ padding: 0 }}
          title="小组余额"
        >
          <div className={styles.salesCard}>
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <HorizontalBar
                    color={DEP_ENV === 'night' ? '#722ED1' : '#1890FF'}
                    height={410}
                    title="小组余额TOP10"
                    data={teamBalance}
                    relation={{ x: 'teamName', y: 'balance' }}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>小组余额排行（万元）</h4>
                  <ul className={styles.rankingList}>
                    {teamBalance.map((item, i) => (
                      <li key={item.teamName}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.teamName}>
                          {item.teamName}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.balance).format('0,0[.][000000]')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <Card
          style={{ marginTop: 16 }}
          loading={queryCardLoading}
          bordered={false}
          // bodyStyle={{ padding: 0 }}
          title="卡片余额"
        >
          <div className={styles.salesCard}>
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <HorizontalBar
                    color={DEP_ENV === 'night' ? '#722ED1' : '#1890FF'}
                    padding={['auto', 'auto', 'auto', 180]}
                    height={410}
                    title="卡片余额TOP10"
                    data={cardBalance}
                    relation={{ x: 'cardNo', y: 'balance' }}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>卡片余额排行（万元）</h4>
                  <ul className={styles.rankingList}>
                    {cardBalance.map((item, i) => (
                      <li key={item.cardNo}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.cardNo}>
                          {item.cardNo}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.balance).format('0,0[.][000000]')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BalanceStatistic;
