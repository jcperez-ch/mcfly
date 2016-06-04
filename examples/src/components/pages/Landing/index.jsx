import React, { Component, PropTypes } from 'react';

import Routed from '../../../mixins/RouteMixin';

import Header from '../../header';

@Routed()
export default class Landing extends Component {
  render() {
    return (
      <div className="landing-page">
        <Header />
        <div className="screen">
          <h1>Flaxs = Flux + Redux Principles</h1>
          <h3>List of Examples</h3>
          <ul>
            <li><a href="/" onClick={this.pushPath.bind(this)}>Basic Usage</a></li>
            <li><a href="/multiple-stores" onClick={this.pushPath.bind(this)}>Multiple Stores</a></li>
            <li><a href="/" onClick={this.pushPath.bind(this)}>Reducers</a></li>
            <li><a href="/" onClick={this.pushPath.bind(this)}>React Integration</a></li>
          </ul>
        </div>
      </div>
    );
  }
}
