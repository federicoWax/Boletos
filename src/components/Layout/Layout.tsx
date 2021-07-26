import { FC, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
  ArrowLeftOutlined, SettingOutlined, FileOutlined, TeamOutlined, UserOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import firebase from '../../firebase/firebase';
import { useAuth } from "../../context/AuthContext";
import { MdDirectionsBoat } from 'react-icons/md';
import { BiDoorOpen, BiLogIn } from 'react-icons/bi';

const { Sider } = Layout;
const { SubMenu } = Menu;

const LayoutComponent: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean | undefined>(true);
  const { user } = useAuth();

  const onCollapse = (collapsed: boolean | undefined) => setCollapsed(collapsed);
  
  const signOut = async () => await firebase.auth().signOut();
  
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="3" icon={<MdDirectionsBoat />}>
          Botes
        </Menu.Item>
      {
        user 
        ?
          <>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="1" icon={<SettingOutlined />}>
              <Link to="/perfil">Mi perfil</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<BiDoorOpen />} onClick={signOut}>Cerrar sesión</Menu.Item>
          </SubMenu>
          </>
        :
        <Menu.Item key="2" icon={<BiLogIn />}>
          Login
        </Menu.Item>
      }
       
      </Menu>
    </Sider>
  )
}

export default LayoutComponent
