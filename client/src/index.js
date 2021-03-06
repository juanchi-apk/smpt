import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Components/Login'
import { BrowserRouter, Route, Switch } from 'react-router-dom';


ReactDOM.render(
<BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login}/>
      </Switch>
</BrowserRouter>,
  document.getElementById('root')
);

