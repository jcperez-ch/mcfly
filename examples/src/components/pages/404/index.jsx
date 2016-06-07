import React, { PropTypes } from 'react';
import { partialRight } from 'lodash';

import Routed from '../../../mixins/RouteMixin';

import Header from '../../header';

const Four0Four = ({ history, message }) => {
  return (
    <div>
      <Header />
      <div className="screen">
        <h1>404</h1>
        <main>{message}</main>
        <footer><a href="/" onClick={Four0Four.pushPath.bind(history)}>Go back to normal</a></footer>
      </div>
    </div>
  );
};

export default Routed()(Four0Four);
