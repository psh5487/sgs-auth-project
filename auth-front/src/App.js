import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import Auth from './hoc/auth';

function App () {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/' component={Auth(LandingPage, true)} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
