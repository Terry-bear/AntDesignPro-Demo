import { ConnectProps, ConnectState } from '@/models/connect';
import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);

  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>梵 途 科 技</span>
              </Link>
            </div>
            <div className={styles.desc}>面向企业的大宗物流SaaS平台</div>
          </div>
          {children}
        </div>
        <DefaultFooter
        links={[{
          key: 'brahma Technology Co. Ltd.',
          title: 'brahma Technology Co. Ltd.',
          href: 'https://fantudl.com',
          blankTarget: true
        }, {
          key: '哆啦快运',
          title: '哆啦快运',
          href: 'https://fantudl.com',
          blankTarget: true
        }]}
        copyright="2019梵途科技技术部出品" />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
