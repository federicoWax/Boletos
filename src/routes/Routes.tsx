import { FC } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../views/home/Home";
import Login from "../views/login/Login";

const Routes: FC = () => {
  return (
    <Router>
      <div>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
      </div>
    </Router>
  )
}

export default Routes
