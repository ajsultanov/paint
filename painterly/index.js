const link = document.getElementById('link')
var newAtt = document.createAttribute("new_attrib");
newAtt.value = "newVal";
link.setAttributeNode(newAtt);

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
		case 'ANOTHER_ACTION':
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
	onclick: () => console.log("click logged"),
	type: "button",
	className: "fancy-button",
	style: "font-style: italic; background-color: #ffefaf"
}, "Log click"));

const buttoo = document.body.appendChild(newElement("button", {
	type: "button",
	className: "fancy-button do-once",
	style: "font-style: italic; background-color: #afffef"
}, "Log click ONCE"));
function clickonce() {
	console.log("click logged ONLY ONCE, sir");
	buttoo.removeEventListener("click", clickonce)
}
buttoo.addEventListener("click", clickonce)

document.body.appendChild(newElement("div", {
	className: "fancy-div",
	style: "font-style: italic; background-color: #ffafef; width: 50%; height: 200px; display:none"
}, "~ Fancy Div ~"));

document.body.appendChild(newElement("canvas", {
	width: "480",
	height: "360",
	id: "canvasMan",
	style: "border: 1px solid black; display:none"
}));
const canvas = document.getElementById("canvasMan");
const ctx = canvas.getContext("2d");
const draw = (() => {
	ctx.font = "1cm monospace";
	ctx.fillText("Hello World", 50, 50);
	ctx.font = "italic 64px serif";
	ctx.strokeText("Hello World", 150, 100);
	ctx.fillRect(50, 50, 50, 50);
	ctx.strokeRect(5, 5, 20, 20);
	ctx.strokeRect(10.5, 10.5, 20, 20);
	ctx.beginPath();
	ctx.moveTo(100, 200);
	ctx.lineTo(300, 300);
	ctx.bezierCurveTo(300, 300, 400, 450, 5, 10);
	ctx.quadraticCurveTo(400, 450, 400, 300);
	ctx.arc(100, 200, 50, 0, 5);
	ctx.closePath();
	// ctx.fillStyle = "rgb(100,200,255)";
	ctx.fillStyle = "#64c8ff";
	ctx.fill();
	ctx.strokeStyle = "#000080";
	ctx.lineWidth = 2;
	ctx.lineCap = "round";
	ctx.stroke();
	let c2 = ctx.arc(200, 200, 50, 0, 2*Math.PI);
	const gradient = ctx.createLinearGradient(100, 200, 300, 400);
	gradient.addColorStop(.2, "red")
	gradient.addColorStop(0.5, "#00aa00")
	gradient.addColorStop(.8, "rgb(100,100,255)")
	ctx.fillStyle = gradient;
	ctx.fill();
	// ctx.scale(cx, cy);
	// ctx.rotate(angle);
	// ctx.translate(tx, ty);
	// ctx.transform(a, b, c, d, e, f);
	//	 x1 = a*x + c*y + e, and y1 = b*x + d*y + f
	// ctx.setTransform(a, b, c, d, e, f)
	// ctx.transform(1, 0, 0.5, 1, 0, 0) // shear
})();

let lastX; // Tracks the last observed mouse X position
  let bar = document.getElementById("resize");
  bar.addEventListener("mousedown", event => {
    if (event.button === 0) {
      lastX = event.clientX;
      window.addEventListener("mousemove", moved);
      event.preventDefault(); // Prevent selection
    }
  });
  function moved(event) {
    if (event.buttons === 0) {
      window.removeEventListener("mousemove", moved);
    } else {
      let dist = event.clientX - lastX;
      let newWidth = Math.min(500, Math.max(10, bar.offsetWidth + dist));
      bar.style.width = newWidth + "px";
      lastX = event.clientX;
    }
  }
