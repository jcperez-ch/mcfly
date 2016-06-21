import React, { Component, PropTypes } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { zenburn } from 'react-syntax-highlighter/dist/styles';

import Routed from '../../../mixins/RouteMixin';

import Header from '../../header';

import { CounterWithReducer } from '../../counter';

@Routed()
  export default class CounterWithReducerComponent extends Component {
  render() {
    return ( 
      <div className="landing-page">
        <Header />
        <div className="screen">
          <h1>Flaxs = Flux + Redux Principles</h1>
          <h3>Basics of createReducer: Counter Example</h3>
          <div>
            When creating a Flaxs application, the recommended way is to use reducers. Begin by creating a new reducer in <i>reducers/counter.js</i>:
            
            <SyntaxHighlighter language='javascript' style={zenburn}>
{`export default (state, action) => {
  switch(action.actionType) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const namespace = 'counter';
const initialState = 0;

export {
  namespace,
  initialState,
}`}
            </SyntaxHighlighter>
            
          </div>
          <div> Don't forget to register this reducer in <i>reducers.js</i>:
            <SyntaxHighlighter language='javascript' style={zenburn}>
              {`import counterReducer, * as counter from "./reducers/counter";
flaxs.createReducer(counter.namespace, counterReducer, counter.initialState);
              `}
            </SyntaxHighlighter>
          </div>

          <div>
            Now the React component that create the actual counter can be implemented in <i>components/counter/index.jsx</i>:
            <SyntaxHighlighter language='javascript' style={zenburn}>
{`import React from 'react';
import CounterActions from '../../actions/CounterActions';
import Actions from '../../constants/ActionTypes';
import { connect } from 'react-flaxs';

@connect(state => {
  return {
    counter: state.counter,
  }
})
export class CounterWithReducer extends React.Component {
  render(){
    return (
      <div>
        <h1>{this.props.counter}</h1>
        <button onClick={ CounterActions.increment }>+</button>
        <button onClick={ CounterActions.decrement }>-</button>
      </div>
    );
  }
}`} 
            </SyntaxHighlighter>
          </div>
          <div> 
            There is one thing to notice here: the Actions. The Actions are the event that the Dispatcher will propagate to all the reducers in response to user interactions. 
            For this counter example, only 2 actions are going to be needed:
            <SyntaxHighlighter language="javascript" style={zenburn}>
{`import { assign, reduce } from 'lodash';

const mirror = array => reduce(array, (accumulator, value) => assign(accumulator, { [value]: value }), {});

export default mirror([
  'INCREMENT',
  'DECREMENT',
]);`}
            </SyntaxHighlighter>
          </div>
          <div>
            One of the main advantages of using reducer is the fact it decouples the UI components (in our case, our REACT components) from the store itself.
            To tigh them together, simply add a connect decorator to our component:
          </div>
          <SyntaxHighlighter language='javascript' style={zenburn}>
{`import { connect } from 'react-flaxs';

@connect(state => {
  return {
    counter: state.counter,
  }
})`}
          </SyntaxHighlighter>
          <h1>Result</h1>
          <CounterWithReducer />
        </div> 
      </div>
    );
  }
}
