import { FC, useState } from 'react'
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from "react-router-dom";
import firebase from '../../firebase/firebase';
import { useAuth } from "../../context/AuthContext";
import { MdAttachMoney, MdDirectionsBoat } from 'react-icons/md';
import { BiDoorOpen, BiLogIn } from 'react-icons/bi';

const { Sider } = Layout;
const { SubMenu } = Menu;

const LayoutComponent: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean | undefined>(false);
  const { user } = useAuth();
  const location = useLocation()
  const history = useHistory();

  const onCollapse = (collapsed: boolean | undefined) => setCollapsed(collapsed);
  
  const signOut = async () => await firebase.auth().signOut();

  if(!user && ["/", "/login"].includes(location.pathname)) return null;
  
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item onClick={() => history.push("/rifas")} key="1" icon={<MdAttachMoney /> }>
          Rifas
        </Menu.Item>
        {
          user 
          ?
            <>
            <SubMenu key="sub1" icon={<UserOutlined />} title="Cuenta">
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
