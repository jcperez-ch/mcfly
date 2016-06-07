import { Component, PropTypes } from 'react';

export default function() {
  return function(ReactClass) {
    if (ReactClass.prototype instanceof Component) {

      ReactClass.prototype.pushPath = function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.context.history.push(e.target.getAttribute('href'));
        return false;
      }

      ReactClass.contextTypes = {
        history: PropTypes.object.isRequired,
      };
    } else {
      ReactClass.pushPath = function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.push(e.target.getAttribute('href'));
        return false;
      }
    }

    return ReactClass;
  }
}
