import { FC, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
  ArrowLeftOutlined, SettingOutlined, FileOutlined, TeamOutlined, UserOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import firebase from '../../firebase/firebase';

const { Sider } = Layout;
const { SubMenu } = Menu;

const LayoutComponent: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean | undefined>(true);

  const onCollapse = (collapsed: boolean | undefined) => setCollapsed(collapsed);
  
  const signOut = async () => await firebase.auth().signOut();
  
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3" icon={<SettingOutlined />}>
            <Link to="/perfil">Mi perfil</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ArrowLeftOutlined />} onClick={signOut}>Cerrar sesión</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />}>
          Files
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default LayoutComponent
