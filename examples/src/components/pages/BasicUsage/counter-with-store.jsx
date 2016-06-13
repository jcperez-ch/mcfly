import React, { Component, PropTypes } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { zenburn } from 'react-syntax-highlighter/dist/styles';

import Routed from '../../../mixins/RouteMixin';

import Header from '../../header';

import { CounterWithStore } from '../../counter';

@Routed()
  export default class CounterWithStoreComponent extends Component {
  render() {
    return ( 
      <div className="landing-page">
        <Header />
        <div className="screen">
          <h1>Flaxs = Flux + Redux Principles</h1>
          <div> 
            Creating store goes against the first principle of Redux, where the whole application share one single store.
            Nevertheless, here is an example of implementation:
          </div>
          <SyntaxHighlighter language="javascript" style={zenburn}>
{`const storeMethods = {
  getState: () => CounterStore.state,
};

const dispatcherCallback = function(payload){
  let newState;
  
  switch(payload.actionType) {
    case Actions.INCREMENT_COUNTER_WITH_STORE:
      newState = { ...payload.state };
      newState.counter ++; 
      break;
    case Actions.DECREMENT_COUNTER_WITH_STORE:
      newState = { ...payload.state };
      newState.counter --;
      break;
  }

  this.emitChangeIfStoreChanged(newState);
}

const initialState = {
  counter: 0
};


const CounterStore = flaxs.createStore(
 storeMethods,
 dispatcherCallback,
 initialState
);
`}
          </SyntaxHighlighter>
          <div>
            In Flaxs, a store will define its public methods dispatcher callback and initial state at the creation. It is all it takes.
          </div>
          <div> 
            To connect a React component to this newly created store, the lifecycle hooks of a React component are going to be implemented:
          </div>
          <SyntaxHighlighter language="javascript" style={zenburn}>
{`export class CounterWithStore extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = CounterStore.getState();
  }
  componentDidMount(){
    CounterStore.addChangeListener(this.storeDidChange.bind(this));
  }
  componentWillUnmount(){
    CounterStore.removeChangeListener(this.storeDidChange.bind(this));
  }
  storeDidChange(){
    this.setState(CounterStore.getState())
  }
  render(){
    return(
      <div>
        <h1>{ this.state.counter }</h1>
        <button onClick={ CounterActions.incrementCounterWithStore.bind(this, CounterStore.getState()) }>+</button>
        <button onClick={ CounterActions.decrementCounterWithStore.bind(this, CounterStore.getState()) }>-</button>
      </div>
    )
  }
}`}
          </SyntaxHighlighter>
          <div>
            Here, the dispatcher callback is implemented in the storeDidChange method which is in charge of updating the component state.
           </div>
          <h3>Basics of createReducer: Counter Example</h3>
          <CounterWithStore />
        </div> 
      </div>
    );
  }
}
