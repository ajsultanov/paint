import React from 'react';

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const subscribe = listener => listeners.push(listener);

  const getState = () => (state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        messages: state.messages.concat(action.message),
      };
    case 'DELETE_MESSAGE':
      return {
        messages:
        [...state.messages.slice(0, action.index),
        ...state.messages.slice(action.index + 1)],
      };
    default:
      return state;
  }
}

const initialState = {messages: []};
const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const messages = store.getState().messages;

    return (
      <div className='ui segment'>
        <MessageView messages={messages} />
        <MessageInput />
      </div>
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: '',
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      message: this.state.value,
    });
    this.setState({
      value: '',
    });
  }

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  }
}

class MessageView extends React.Component {
  handleClick = index => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      index: index,
    });
  }

  render() {
    const messages = this.props.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {message}
      </div>
    ));

    return (
      <div className='ui comments'>
        {messages}
      </div>
    )
  }

}

export default App;

// vvv Simple example without using React components vvv
// const listener = () => console.log('Current state: ', store.getState());
// store.subscribe(listener);
//
//
// const addMessage1 = {
//   type: 'ADD_MESSAGE',
//   message: 'OKOKOKOKOK',
// };
// const addMessage2 = {
//   type: 'ADD_MESSAGE',
//   message: 'NONONONONONONONONO',
// }
//
// store.dispatch(addMessage1);
// const stateV1 = store.getState();
// // console.log('State V1: ', stateV1);
//
// store.dispatch(addMessage2);
// const stateV2 = store.getState();
// // console.log('State V2: ', stateV2);
//
// const deleteMessage = {
//   type: 'DELETE_MESSAGE',
//   index: 0,
// }
//
// store.dispatch(deleteMessage);
// const stateV3 = store.getState();
// // console.log('State V3: ', stateV3);
