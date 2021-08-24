import { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import { useAuth } from "../context/AuthContext";
import Footer from '../components/Footer/Footer';
import { Layout } from 'antd';
import LayoutComponent from '../components/Layout/Layout';
import Raffles from '../views/Raffles/Raffles';

const privateRoutes: string[] = [
  "/rifas"
]; 

const publicRoutes: string[] = [
  "/",
  "login"
]

const Routes: FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
          <LayoutComponent />
          <Layout className="site-layout">
            <Layout.Content style={{ margin: '0 16px', padding: 30 }}>
              { publicRoutes.includes(window.location.pathname) && user && <Redirect to="/rifas" /> }
              { privateRoutes.includes(window.location.pathname) && !user && <Redirect to="/login" /> }
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/rifas" component={Raffles} />
              </Switch>
            </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    </Router>
  )
}

export default Routes;