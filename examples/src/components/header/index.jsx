import React, { Component, PropTypes } from 'react';

import { connect } from '../../connectors/Default';

@connect(state => {
  return {
    ...state.routing,
  }
})
export default class Header extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  };
  static contextTypes = {
    history: PropTypes.object.isRequired,
  };
  render() {
    const { action, pathname } = this.props;
    const { history } = this.context;
    const { headerContainer: headerContainerClassName } = require('./header.scss');
    let backButton = <a className="header__back-link" onClick={() => history.goBack()}><i className="fa fa-arrow-left" /></a>;

      if (action !== 'PUSH') {
        backButton = <a className="header__back-link" onClick={() => history.push('/')}><i className="fa fa-arrow-left" /></a>
      }

      return (
        <div className={headerContainerClassName}>
          <div className="screen">
            <header className="cf">
              {pathname === '/' ? null : backButton}
            </header>
          </div>
        </div>
      );
  }
}
