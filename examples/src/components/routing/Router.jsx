import React, { Component, PropTypes, Children } from 'react';
import { find, map } from 'lodash';

import RoutingActions from '../../actions/RoutingActions';
import { connect } from '../../connectors/Default';

@connect(state => {
  return {
    ...state.routing,
  }
})
export default class Router extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };
  static childContextTypes = {
    history: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);
  }
  getChildContext() {
    return { history: this.props.history };
  }
  componentWillMount() {
    const { history } = this.props;
    RoutingActions.loadRoutes(history.getCurrentLocation());
    this.unlisten = history.listen(location => {
      switch (location.action) {
        case 'PUSH':
          RoutingActions.pushRoute(location);
          break;
        case 'POP':
          RoutingActions.popRoute(location);
          break;
        case 'REPLACE':
          RoutingActions.replaceRoute(location);
          break;
        default:
      }
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }
  matchPathnameWithRoutes() {
    const { children, history, notFound, pathname, pendingHistory } = this.props;
    const route = find(children, route => route.props.path === pathname);

    if (pendingHistory) {
      return <div>Loading application</div>;
    }

    return route ?
      Children.only(route) :
      notFound({ message: 'No page found, you dummy', history });
  }
  render() {
    return (
      <div clasName="page">{this.matchPathnameWithRoutes()}</div>
    );
  }
}
