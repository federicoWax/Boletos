import { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import { useAuth } from "../context/AuthContext";
import Footer from '../components/Footer/Footer';
import { Layout } from 'antd';
import LayoutComponent from '../components/Layout/Layout';
import Raffles from '../views/Raffles/Raffles';
import Tickets from '../views/tickets/tickets';
import Questions from '../views/questions/Questions';

const privateRoutes: string[] = [
  "/rifas",
  "/boletos"
]; 

const publicRoutes: string[] = [
  "/login"
];

const Routes: FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Layout style={{ height: '100vh', maxWidth: '100wh', overflow: "hidden"}}>
          <LayoutComponent />
          <Layout className="site-layout">
            <Layout.Content>
              { window.location.pathname === "/" && <Redirect to="/lista" /> }
              { publicRoutes.includes(window.location.pathname) && user && <Redirect to="/rifas" /> }
              { privateRoutes.includes(window.location.pathname) && !user && <Redirect to="/login" /> }
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/lista" component={Home} />
                <Route exact path="/rifas" component={Raffles} />
                <Route exact path="/boletos/:raffleId" component={Tickets} />
                <Route exact path="/preguntas" component={Questions} />
              </Switch>
            </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    </Router>
  )
}

export default Routes;