import React, { Component } from 'react';
import { createHistory } from 'history';

import Router from './components/routing/Router';
import Route from './components/routing/Route';

import Four0Four from './components/pages/404';
import Landing from './components/pages/Landing/';
import MultipleStores from './components/pages/MultipleStores/';
import BasicUsage from './components/pages/BasicUsage/';
import CounterWithReducer from './components/pages/BasicUsage/counter-with-reducer';
import CounterWithStore from './components/pages/BasicUsage/counter-with-store';

import './reducers';

const history = createHistory();

export default class App extends Component {
  render() {
    return (
      <Router notFound={Four0Four} history={history}>
        <Route path="/" component={Landing} />
        <Route path="/multiple-stores" component={MultipleStores} />
        <Route path="/basic-usage" component={BasicUsage} />
        <Route path="/counter-with-reducer" component={CounterWithReducer} />
        <Route path="/counter-with-store" component={CounterWithStore} />
      </Router>
    );
  }
}
