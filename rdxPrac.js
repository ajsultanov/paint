
function reducer(state, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
			break;
		case 'DECREMENT':
			return state - 1;
			break;
		case 'INCREMENT_AMT':
			return state + action.amount;
			break;
		case 'DECREMENT_AMT':
			return state - action.amount;
			break;
		default:
			return state;
	};
}

const incrementAction = {type: 'INCREMENT'};
const decrementAction = {type: 'DECREMENT'};
const incrementAmtAction = {type: 'INCREMENT_AMT', amount: 10};
const decrementAmtAction = {type: 'DECREMENT_AMT', amount: 5};
const unknownAction = {type: 'UNKNOWN'};

function createStore(reducer) {
	let state = 0;

	const getState = () => state;	// state in parens in text

	const dispatch = action => state = reducer(state, action);
	// store.dispatch({ type: 'INCREMENT', amount: 7})

	return {
		getState,
		dispatch,
	};
}

const store = createStore(reducer);

store.dispatch(incrementAction)
console.log(store.getState());

store.dispatch(decrementAction)
console.log(store.getState());

store.dispatch(incrementAmtAction)
console.log(store.getState());

store.dispatch(decrementAmtAction)
console.log(store.getState());

store.dispatch(unknownAction)
console.log(store.getState());
