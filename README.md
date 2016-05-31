# McFly
Flux Architecture Made Easy

*What is McFly?*

When writing ReactJS apps, it is enormously helpful to use Facebook's Flux architecture. It truly complements ReactJS' unidirectional data flow model. Facebook's Flux library provides a Dispatcher, and some examples of how to write Actions and Stores. However, there are no helpers for Action & Store creation, and Stores require 3rd party eventing.

McFly is a library that provides all 3 components of Flux architecture, using Facebook's Dispatcher, and providing factories for Actions & Stores.

## Demo

Check out this JSFiddle Demo to see how McFly can work for you:

[http://jsfiddle.net/6rauuetb/](http://jsfiddle.net/6rauuetb/)

## Download

McFly can be downloaded from:

[http://kenwheeler.github.io/mcfly/McFly.js](http://kenwheeler.github.io/mcfly/McFly.js)

## Dispatcher

McFly uses Facebook Flux's dispatcher. When McFly is instantiated, a single dispatcher instance is created and can be accessed like shown below:

```javascript
var mcFly = new McFly();

return mcFly.dispatcher;
```
In fact, all created Actions & Stores are also stored on the McFly object as `actions` and `stores` respectively.

## Stores

McFly has a **createStore** helper method that creates an instance of a Store. Store instances have been merged with EventEmitter and come with **emitChange**, **addChangeListener** and **removeChangeListener** methods built in.

When a store is created, its methods parameter specifies what public methods should be added to the Store object. Every store is automatically registered with the Dispatcher and the `dispatcherID` is stored on the Store object itself, for use in `waitFor` methods.

Creating a store with McFly looks like this:

```javascript
var _todos = [];

function addTodo(text) {
  _todos.push(text);
}

var TodoStore = mcFly.createStore({

getTodos: function() {
  return _todos;
}

}, function(payload){
  var needsUpdate = false;

  switch(payload.actionType) {
  case 'ADD_TODO':
    addTodo(payload.text);
    needsUpdate = true;
    break;
  }

  if (needsUpdate) {
    TodoStore.emitChange();
  }

});
```

Use `Dispatcher.waitFor` if you need to ensure handlers from other stores run first.

```javascript
var mcFly = new McFly();
var Dispatcher = mcFly.dispatcher;
var OtherStore = require('../stores/OtherStore');
var _todos = [];

function addTodo(text, someValue) {
  _todos.push({ text: text, someValue: someValue });
}

 ...

    case 'ADD_TODO':
      Dispatcher.waitFor([OtherStore.dispatcherID]);
      var someValue = OtherStore.getSomeValue();
      addTodo(payload.text, someValue);
      break;

 ...
```

Stores are also created a with a ReactJS component mixin that adds and removes store listeners that call a **storeDidChange** component method.

Adding Store eventing to your component is as easy as:

```javascript
var TodoStore = require('../stores/TodoStore');

var TodoApp = React.createClass({

  mixins: [TodoStore.mixin],

})
```

## Reducers

Motivated by Redux, the most popular flux implementation, reducers are reduced dispatched callbacks that modify a single state of the application.  Similar to Stores in mcFly but suppressing the getters object and incorporating by default the global state of the master store.

Reducers in this project follow the 3 basic principles of Redux ([Read about Redux](http://redux.js.org/docs/introduction/ThreePrinciples.html)), which are:

- **A single master store**. A single store containing no getters and a unique state for the whole application.
- **Immutable state**. That means that the store contains a state which is a one-level object with immutable attribute values. The only way to mutate the state is to emit an action, an object describing what happened.
- **State changes are made via pure functions**. Reducers are just pure functions that take the previous state and an action, and return the next state. Many reducers can make modifications through different portions of the state in different reducers, so we avoid chaining actions in our components and we avoid triggering actions inside our stores/reducers.

Unlike redux, mcfly uses synchrously EventEmitter to make changes in a store.

#### The Master Store

Master store is contained in every mcfly instance.  You can see that this store saves the references for all the payload callbacks registered as 'Reducers' so we can reuse the AppDispatcher.waitFor using those identifiers to wait for other reducers.

The 'reducer' makes a check in the state to see if there was a change, then evaluates whether to emit a change for the master store or not.

This store has a `mergeState(newState)` function, which will merge all the initial states dictated by the reducers once they are registered.  Ideally a place where to register all the reducers is just right after the application loads.

Once the application is initially loaded we can modify the state on the fly via the dispatcher.

Considering the store example, a reducer looks like this:

```js
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

var TodoStore = mcFly.createReducer(
  'TodoListReducer',
  (state, {actionType, ...params}) => {
    switch (actionType) {
      case 'ADD_TODO':
        return addTodo(state, params.text);
      default:
    }
    return state;
  },
  initialState
);
```

You can always create your `Connect` components by using:

```js
mcfly.store.state;
// returns { todos: ['Todo 1', 'etc...'] }
```

You can wait for your reducer to be finished like:

```js
case 'ADD_TODO':
  flux.dispatcher.waitFor('TodoListReducer');
  // Your state update goes here.
```

or wait for several reducers like:

```js
case 'ADD_TODO':
  flux.dispatcher.waitFor(['TodoListReducer', 'AnotherReducer']);
  // Your state update goes here.
```  

# Connecting React components

An easy example would be to subscribe to changes of the master store, since that is the store that emits the events:

```js
class Connection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = mapStateToProps(mcfly.store.state);
    // mapStateToProps() assures the state reference is changed
    // if the master store state
    this.storeDidChange = this.storeDidChange.bind(this);
  }
  componentWillMount() {
    mcfly.store.addChangeListener(this.storeDidChange);
  }
  componentWillUnmount() {
    mcfly.store.removeChangeListener(this.storeDidChange);
  }
  storeDidChange() {
    const newState = mapStateToProps(mcfly.store.state);

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

## Actions

McFly's **createActions** method creates an Action Creator object with the supplied singleton object. The supplied methods are inserted into a Dispatcher.dispatch call and returned with their original name, so that when you call these methods, the dispatch takes place automatically.

Adding actions to your app looks like this:

```javascript
var mcFly = require('../controller/mcFly');

var TodoActions = mcFly.createActions({
  addTodo: function(text) {
    return {
      actionType: 'ADD_TODO',
      text: text
    }
  }
});
```

All actions methods return promise objects so that components can respond to long functions. The promise will be resolved with no parameters as information should travel through the dispatcher and stores. To reject the promise, return a falsy value from the action's method. The dispatcher will not be called if the returned value is falsy or has no actionType.

You can see an example of how to use this functionality here:

http://jsfiddle.net/thekenwheeler/32hgqsxt/

## API

### McFly

```javascript
var McFly = require('mcfly');

var mcFly = new McFly();
```

### createStore

```javascript
/*
 * @param {object} methods - Public methods for Store instance
 * @param {function} callback - Callback method for Dispatcher dispatches
 * @return {object} - Returns instance of Store
 */
```

### createActions

```javascript
/**
 * @param {object} actions - Object with methods to create actions with
 * @constructor
 */
```
