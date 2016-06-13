import React from 'react';
import CounterActions from '../../actions/CounterActions';
import Actions from '../../constants/ActionTypes';
import { connect } from 'react-flaxs';
import { flaxs } from 'flaxs';

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
        <button onClick={ CounterActions.incrementCounterWithReducer }>+</button>
        <button onClick={ CounterActions.decrementCounterWithReducer }>-</button>
      </div>
    );
  }
}

const storeMethods = {
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

export class CounterWithStore extends React.Component {
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
}
