import React, { Component } from 'react';

import { connect } from '../../connectors/Default'

export default class Route extends Component {
  render() {
    const { component: Component, ...props } = this.props;
    return (
      <div clasName="page"><Component {...props } /></div>
    );
  }
}
