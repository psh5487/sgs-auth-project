import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AdminPage from './views/AdminPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import Auth from './hoc/auth';

function App () {
  return (
    <Router>
      <div>
        <Switch>
          {/* option =>  null: 아무나 접근 가능, true: 로그인한 유저만 접근 가능, false: 로그인한 유저는 접근 불가능 */}
          <Route exact path='/' component={Auth(AdminPage, true)} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
