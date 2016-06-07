# Flaxs

[![Build Status](https://travis-ci.org/jcperez-ch/flaxs.svg?branch=master)](https://travis-ci.org/jcperez-ch/flaxs)
[![npm version](https://img.shields.io/npm/v/flaxs.svg?style=flat-square)](https://www.npmjs.com/package/flaxs)

```
const Flaxs = Flux + Redux.principles()
```
Flaxs incorporates a flux architecture reusing Facebook's Flux `Dispatcher` principle and the Event publish/subscribe pattern.  
Motivated by Redux and Flux, reducers are reduced-pure callbacks that modify a single state of the application.  Similar to Stores in McFly but suppressing the getters object and incorporating by default the global state of the master store.

Reducers in this project follow the 3 basic principles of Redux ([Read about Redux](http://redux.js.org/docs/introduction/ThreePrinciples.html)), which are:

- **A single master store**. A single store containing no getters and a unique state for the whole application.
- **Immutable state**. That means that the store contains a state which is a one-level object with immutable attribute values. The only way to mutate the state is to emit an action, an object describing what happened.
- **State changes are made via pure functions**. Reducers are just pure functions that take the previous state and an action, and return the next state. Many reducers can make modifications through different portions of the state in different reducers, so we avoid chaining actions in our components and we avoid triggering actions inside our stores/reducers.

When writing component based applications, it is enormously helpful to use Facebook's Flux architecture. It truly complements ReactJS' unidirectional data flow model. Facebook's Flux library provides a Dispatcher, and some examples of how to write Actions and Stores. However, there are no helpers for Action & Store creation, and Stores require 3rd party eventing.

Flaxs is a library that provides all 3 components of Flux architecture, using Facebook's Dispatcher, and providing factories for Actions & Stores.

### Forked from

*Flaxs* was created initially as a fork of [McFly v0.0.10](https://github.com/kenwheeler/mcfly).  
Thanks to [kenwheeler](https://github.com/kenwheeler) for letting this project to happen.


## Examples

You can review in detail our [examples guideline page](./tree/master/examples/README.md):

## Demo Page

Right now, we don't have a demo page, nonetheless we have an examples folder which will allow us to explain in detail the potential of Flaxs.

## Dispatcher

Flaxs uses Facebook Flux's dispatcher. When Flaxs is instantiated, a single dispatcher instance is created and can be accessed like shown below:

```javascript
import { flaxs } from 'flaxs';

return flaxs.dispatcher;
```
In fact, all created Actions & Stores are also stored on the Flaxs object as `actions` and `stores` respectively.

## Stores

**Stores in Flaxs are used to preserve compatibility with McFly approach, but are not recommended to use for new projects.**

Since Flaxs brings the `reducer` functions, we don't need different places to store the state of the application.  Instead we use the `MasterStore` explained in this document forward.

When a store is created, its methods parameter specifies what public methods should be added to the Store object. Every store is automatically registered with the Dispatcher and the `dispatcherID` is stored on the Store object itself, for use in `waitFor` methods.

Creating a store with Flaxs using pure functions, you do this:

```javascript
var _todos = [];

const addTodo = (todos, text) => ([
  ...todos,
  text,
]);

const TodoStore = flaxs.createStore({

  getTodos: function() {
    return _todos;
  }

}, function({ actionType, params }){
  let newTodos;

  switch(actionType) {
  case 'ADD_TODO':
    if (!_todos.includes(params.text)) {
      newTodos = addTodo(_todos, params.text);
    }
    break;
  }

  if (newTodos !== undefined && newTodos !== _todos) {
    _todos = Object.freeze(newTodos);
    TodoStore.emitChange();
  }
});
```

Use `Dispatcher.waitFor` if you need to ensure handlers from other stores run first.

```js
case 'ADD_ANOTHER_TODO': {
  flaxs.dispatcher.waitFor([OtherStore.dispatcherID]);
  const someValue = OtherStore.getSomeValue();
  if (!_todos.includes(someValue)) {
    newTodos = addTodo(_todos, someValue);
  }
  break;
}
```

Stores are also created a with a ReactJS component mixin that adds and removes store listeners that call a **storeDidChange** component method.

### React Integration

Adding Store eventing to your component is as easy as:

```javascript
const { TodoStore } from '../stores/TodoStore';

var TodoApp = React.createClass({

  mixins: [TodoStore.mixin],

  render() {}
})
```

**Important**.  The mixin component created in the store, is preserved to keep compatibility with McFly as well, but will get deprecated once `react-flaxs` project sees the light.  Flaxs will not contain itself any dependency from ReactJS.

## Reducers

Unlike redux, flaxs uses asynchronously an EventEmitter to make changes in a store.  This was part of the heritage from mcFly project.

#### The Master Store

Master store is contained in every fl instance.  You can see that this store saves the references for all the payload callbacks registered as 'Reducers' so we can reuse the `flaxs.dispatcher.waitFor` to wait for other reducers as well.

The 'reducer' makes a check in the reduced state object to see if there was a change, then evaluates whether to emit a change for the master store or not.

Similar to redux, if the reduced state object is not changed, but *mutated* instead, then the master store won't emit changes to all connected components.

This store has a `mergeState(newState)` function, which will merge all the initial states dictated by the reducers once they are registered.  Ideally a place where to register all the reducers is just right after the application loads.

Once the application is initially loaded we can modify the state on the fly via the dispatcher.

Considering the store example, a reducer looks like this:

```js
import { flaxs } from 'flaxs';

let initialState = {
  todos: []
};

function addTodo(state, text) {
  if (!state.todos.includes(text)) {
    return {
      ...state,
      todos: [ ...state.todos, text ],
    }
  }
  return state;
}

const TodoListReducer = flaxs.createReducer(
  'listReducer',
  (state, {actionType, ...params}) => {
    switch (actionType) {
      case 'ADD_TODO':
        return addTodo(state, params.text);
      default:
    }
    return state;
  },
  initialState,
);
```

You can always create your `Connect` components by using:

```js
flaxs.store.state;
// returns { listReducer: { todos: ['Todo 1', 'etc...'] } }
```

You can wait for your reducer to be finished like:

```js
case 'ADD_TODO':
  flaxs.dispatcher.waitFor('TodoListReducer');
  // Your state update goes here.
```

or wait for several reducers like:

```js
case 'ADD_TODO':
  flaxs.dispatcher.waitFor(['TodoListReducer', 'AnotherReducer']);
  // Your state update goes here.
```  

# Connecting React components

An easy example would be to subscribe to changes of the master store, since that is the store that emits the events:

```js
class Connection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = mapStateToProps(flaxs.store.state);
    // mapStateToProps() assures the state reference is changed
    // if the master store state
    this.storeDidChange = this.storeDidChange.bind(this);
  }
  componentWillMount() {
    flaxs.store.addChangeListener(this.storeDidChange);
  }
  componentWillUnmount() {
    flaxs.store.removeChangeListener(this.storeDidChange);
  }
  storeDidChange() {
    const newState = mapStateToProps(flaxs.store.state);

    if (newState !== this.state)) {
      this.setState(newState);
    }
  }
  render() {
    return null; // Here goes whatever you like
  }
}
```

You can create as many connectors as you wish, in order to make your components reactive.

Eventually the *connectors* will be implemented and extended in `react-flaxs` to integrate it with ReactJS.

## Actions

Flaxs's **createActions** method creates an Action Creator object with the supplied singleton object. The supplied methods are inserted into a Dispatcher.dispatch call and returned with their original name, so that when you call these methods, the dispatch takes place automatically.

Adding actions to your app looks like this:

```javascript
import { flaxs } from 'flaxs';

const TodoActions = flaxs.createActions({
  addTodo: (text) => ({
    actionType: 'ADD_TODO',
    text,
  }),
});
```

All actions methods return promise objects so that components can respond to long functions. The promise will be resolved with no parameters as information should travel through the dispatcher and stores. To reject the promise, return a falsy value from the action's method. The dispatcher will not be called if the returned value is falsy or has no actionType.

You can see an example of how to use this functionality here:

http://jsfiddle.net/thekenwheeler/32hgqsxt/

## API

### Instantiating Flaxs

There are 2 ways to have a Flaxs instance fluxing the application:

```javascript
import Flaxs from 'flaxs';

const flaxs = new Flaxs({ ...initialState });
```
or
```javascript
import { flaxs } from 'flaxs';

// const flaxs contains an already instantiated Flaxs() object with an empty initialState;
```
