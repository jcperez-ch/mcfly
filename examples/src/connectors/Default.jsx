import React, { Component } from 'react';
import { identity, some } from 'lodash';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { flaxs } from '../../../';

/**
 * Took it from connect module in redux.
 * @param  {ReactElement} WrappedComponent
 * @return {String}
 */
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const defaultMapOwnProps = (mapedStateToProps, ownProps) => ({
  ...mapedStateToProps,
  ...ownProps,
});

export function connect(mapStateToProps = identity, mapOwnProps = defaultMapOwnProps) {
  return function(ReactClass) {
    class Connection extends Component {
      static displayName = `_(${getDisplayName(ReactClass)})_`;
      constructor(props, context) {
        super(props, context);
        this.state = flaxs.store.state;
        this.storeDidChange = this.storeDidChange.bind(this);
      }
      componentDidMount() {
        flaxs.store.addChangeListener(this.storeDidChange);
        this.isComponentMounted = true;
      }
      componentWillUnmount() {
        flaxs.store.removeChangeListener(this.storeDidChange);
        this.isComponentMounted = false;
      }
      getConnectedProps(props = this.props, state = this.state) {
        return mapOwnProps(mapStateToProps(state), props);
      }
      shouldComponentUpdate(nextProps, nextState, nextContext) {
        const nextConnectedProps = this.getConnectedProps(nextProps, nextState);
        const connectedProps = this.getConnectedProps()
        return nextContext !== this.context || some(nextConnectedProps, (nextProp, propKey) =>
          nextProp !== connectedProps[propKey]
        )
      }
      storeDidChange() {
        const newState = flaxs.store.state;
        // FIXME since events occur asynchronously, we can have the case where the component
        // listens for a change in the store, but the change occurs after it gets unmounted.
        if (this.isComponentMounted && newState !== this.state) {
          this.setState(newState);
        }
      }
      render() {
        return React.createElement(ReactClass, this.getConnectedProps());
      }
    }

    return hoistNonReactStatics(Connection, ReactClass);
  };
}
