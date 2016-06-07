import React, { Component, PropTypes } from 'react';

import Routed from '../../../mixins/RouteMixin';

import Header from '../../header';

@Routed()
export default class MultipleStores extends Component {
  render() {
    return (
      <div className="landing-page">
        <Header />
        <div className="screen">
          <h1>Flaxs = Flux + Redux Principles</h1>
          <h3>Multiple Stores Example</h3>
        </div>
      </div>
    );
  }
}
