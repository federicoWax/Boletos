import { FC } from 'react';
import { Layout } from 'antd';

const FooterComponent: FC = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>Rifas Herson { (new Date()).getFullYear() } © </Layout.Footer>
  )
}

export default FooterComponent;
