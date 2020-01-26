const link = document.getElementById('link')
var att = document.createAttribute("new_attrib");
att.value = "newVal";
link.setAttributeNode(att);
// link.setAttributeNode();

console.log(link)

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
};
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

function newElement(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child === "string") {
			dom.appendChild(document.createTextNode(child))
		}
    else {
			dom.appendChild(child)
		};
  }
  return dom;
}
document.body.appendChild(newElement("button", {
	onclick: () => console.log("click logged, sir"),
	type: "button",
	className: "fancy-button",
	style: "font-style: italic; background-color: #ffefaf"
}, "Log click"));
