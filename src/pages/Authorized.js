import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import Exception from '@/components/Exception';
import { getAuthority } from '@/utils/authority';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Redirect from 'umi/redirect';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => {
  let noMatch = (
    <Exception
      type="403"
      desc={formatMessage({ id: 'app.exception.description.403' })}
      linkElement={Link}
      redirect="/login"
      backText="返回登录"
    />
  );
  // if Authority === ['guest'] redirect to /login
  // You can implement the logic here.
  if (!Authority || Authority.join('') === '') {
    noMatch = <Redirect to="/login" />;
  }
  return (
    <Authorized authority={children.props.route.authority} noMatch={noMatch}>
      {children}
    </Authorized>
  );
};
