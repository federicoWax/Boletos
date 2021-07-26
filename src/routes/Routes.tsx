import { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import { useAuth } from "../context/AuthContext";
import Footer from '../components/Footer/Footer';
import { Layout } from 'antd';
import LayoutComponent from '../components/Layout/Layout';
import Profile from '../views/profile/Profile';

const Routes: FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
          { <LayoutComponent /> }
          <Layout className="site-layout">
            <Layout.Content style={{ margin: '0 16px' }}>
              {window.location.pathname === "/login" && user && <Redirect to="/" />}
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/perfil" component={Profile} />
              </Switch>
            </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    </Router>
  )
}

export default Routes;