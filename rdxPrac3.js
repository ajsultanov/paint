import React from 'react';
import { createStore } from 'redux';
import uuid from 'uuid';

// function createStore(reducer, initialState) {
//   let state = initialState;
//   const listeners = [];
//
//   const subscribe = (listener) => (
//     listeners.push(listener)
//   );
//
//   const getState = () => (state);
//
//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach(l => l());
//   };
//
//   return {
//     subscribe,
//     getState,
//     dispatch,
//   };
// }

const initialState = {
  activeThreadId: '1-fca2',
  threads: [
    {
      id: '1-fca2',
      title: 'Buzz',
      messages: [
        {
          text: 'twelve minutes',
          timestamp: Date.now(),
          id: uuid.v4(),
        },
      ],
    },
    {
      id: '2-be91',
      title: 'Michael',
      messages: [],
    },
  ],
};

const store = createStore(reducer, initialState);

function reducer(state, action) {
  const threads = state.threads;

  if (action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    }
    const threadIndex = threads.findIndex(
      t => t.id === action.threadId
    );
    const oldThread = threads[threadIndex];
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.concat(newMessage),
    };

    return {
      // messages: state.messages.concat(newMessage),
      ...state,
      threads: [
        ...threads.slice(0, threadIndex),
        newThread,
        ...threads.slice(threadIndex+1, threads.length)
      ]
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    const threadIndex = state.threads.findIndex(
      t => t.messages.find(m => (
        m.id === action.id
      ))
    );
    const oldThread = state.threads[threadIndex];
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.filter(m => (
        m.id !== action.id
      ))
    };

    return {
      // messages: state.messages.filter((m) => (
      //   m.id !== action.id
      // ))
      ...state,
      threads: [
        ...threads.slice(0, threadIndex),
        newThread,
        ...threads.slice(threadIndex+1, threads.length)
      ]
    };
  } else {
    return state;
  }
}

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    // const messages = store.getState().messages;
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const activeThread = threads.find(t => t.id === activeThreadId);

    const tabs = threads.map(t => (
      {
        title: t.title,
        active: t.id === activeThreadId,
      }
    ))

    return (
      <div className='ui segment'>
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class ThreadTabs extends React.Component {
  render() {
    const tabs = this.props.tabs.map((tab, index) => (
      <div
        key={index}
        className={tab.active ? 'active item' : 'item'}
      >
        {tab.title}
      </div>
    ));
    return (
      <div className='ui top attached tabular menu'>
        {tabs}
      </div>
    );
  }
}

class Thread extends React.Component {
  handleClick = (id) => {
    console.log(id);
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id,
    });
  };

  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
        <div className='text'>
          {message.text}
          <span className='metadata'>@{message.timestamp}</span>
        </div>
      </div>
    ));

    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id}/>
      </div>
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    console.log(this.props.threadId);
    if (this.state.value !== '') {
      store.dispatch({
        type: 'ADD_MESSAGE',
        text: this.state.value,
        threadId: this.props.threadId,
      });
      this.setState({
        value: '',
      });
    }
  };

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


export default App;
