import { FC, useState } from 'react'
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from "react-router-dom";
import firebase from '../../firebase/firebase';
import { useAuth } from "../../context/AuthContext";
import { MdAttachMoney } from 'react-icons/md';
import { BiDoorOpen } from 'react-icons/bi';

const { Sider } = Layout;
const { SubMenu } = Menu;

const LayoutComponent: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean | undefined>(true);
  const { user } = useAuth();
  const location = useLocation()
  const history = useHistory();

  const onCollapse = (collapsed: boolean | undefined) => setCollapsed(collapsed);
  
  const signOut = async () => {
    await firebase.auth().signOut();
    history.push("/login");
  }

  if(!user && ["/lista", "/login", "/preguntas"].includes(location.pathname)) return null;
  
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline">
        <Menu.Item onClick={() => history.push("/rifas")} key="/rifas" icon={<MdAttachMoney /> }>
          Rifas
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="Cuenta">
          <Menu.Item key="4" icon={<BiDoorOpen />} onClick={signOut}>Cerrar sesión</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default LayoutComponent
