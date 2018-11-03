import React, { PureComponent } from 'react';
import router from 'umi/router';
import { getAuthority } from '@/utils/authority';
import { authority } from '@/constant';

export default class Index extends PureComponent {
  componentDidMount() {
    const roleCode = getAuthority()[0];

    switch (roleCode) {
      default:
      case authority.cardmanager:
        router.push('/task/create');
        return;
      case authority.teamleader:
        router.push('/task/registration');
        return;
      case authority.operator:
        router.push('/task/registration');
        return;
      case authority.auditor:
        router.push('/task/create');
        return;
      case authority.admin:
        router.push('/statistic/card');
        return;
      case authority.superadmin:
        router.push('/statistic/card');
        return;
      case authority.billingmanager:
        router.push('/statistic/balance');
    }
  }

  render() {
    return <div />;
  }
}
