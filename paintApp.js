function createStore(reducer, initialState) {
	let state = initialState;
	const getState = () => state;
	const dispatch = action => state = reducer(state, action);
	return {
		getState,
		dispatch,
	};
}
const initialState = {
	height: 0,
	width: 0,
	pixels: [],
	draw: {},
}
const store = createStore(reducer, initialState);
function reducer(state, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state;
			break;
		case 'DECREMENT':
			return state;
			break;
		case 'SOMETHING_ELSE':
			return state;
			break;
		default:
			return state;
	};
}
