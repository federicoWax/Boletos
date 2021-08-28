import { FC } from 'react';
import { Layout } from 'antd';

const FooterComponent: FC = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center', color: "white", backgroundColor: "black", fontSize: 20 }}>
      Rifas Herson { (new Date()).getFullYear() } © 
    </Layout.Footer>
  )
}

export default FooterComponent;
