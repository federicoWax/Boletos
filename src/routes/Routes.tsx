import { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import { useAuth } from "../context/AuthContext";

const Routes: FC = () => {
  const { user } = useAuth();
  
  return (
    <Router>
      {window.location.pathname === "/login" && user && <Redirect to="/" />}
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
    </Router>
  )
}

export default Routes
