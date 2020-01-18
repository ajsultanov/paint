console.log("hewwo");

// application state is an object with picture, tool, and color properties
/*
  state.picture
    .width
    .height
    .pixels
    .draw
  state.tool
  state.color
  state.done?
  state.doneAt?
*/

class Picture {
  constructor(width, height, pixels) {
    console.log("picture");
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {

    // calling the Array constructor with an argument creates a new array with given length
    // the fill method can be used to fill an array with a value (with optional index start and end values)

    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  /*
    say we have a 4x4 picture, the array of pixels would look like this:
      0, 1, 2, 3
      4, 5, 6, 7
      8, 9, 10, 11
      12, 13, 14, 15

    multiplying y by the width effectively operates the y-axis of this matrix
    pixel(2, 3) = pixel 14
    pixel(0, 1) = pixel 4
    pixel(1, 0) = pixel 1
  */
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  // for updating many pixels at once
  draw(pixels) {
    let copy = this.pixels.slice();
    //        ?  ? where do these come from
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

// allows the interface to dispatch actions which will change the state
function updateState(state, action) {
  // before ES6 used to be: return Object.assign({}, state, action);
  return {...state, ...action};
}

// helper function to create an element, give it some properties and child nodes

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

// which allows the following style of registering event handlers
 document.body.appendChild(elt("button", {
   onclick: () => console.log("click"),
   type: "button",
   className: "fancy-button",
   style: "font-style: italic; background-color: #fed"
 }, "Log click"));

 document.body.appendChild(elt("button", {
   onclick: () => console.log("click dos"),
   type: "button",
   disabled: true
 }, "Log click numero dos"));

 // draws each pixel as a 10x10 square
const scale = 10;

// this component has two responsibilities: 1.displaying the picture as a grid of colored boxes and 2.communicating pointer events from this picture
// cannot directly dispatch actions as it does not know the whole application state, only the current picture
class PictureCanvas {
  constructor(picture, pointerDown) {
    console.log("picturecanvas");
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    // console.log(this.mouse);
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    // only redraws when given a new picture
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}

function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  // CanvasRenderingContext2D
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  // 0 is the left mouse button, 1 middle and 2 right
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  console.log(pos);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  // can return another callback function to be notified when the pointer is moved to a different pixel while held down
  this.dom.addEventListener("mousemove", move);
};

// takes initial mouseevent and the canvas element
function pointerPosition(pos, domNode) {
  // the position of the canvas on the screen
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}

// similar but with different events
PictureCanvas.prototype.touch = function(startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  // prevents panning
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};

// container component for the picture canvas and tools
class PixelEditor {
  constructor(state, config) {
    console.log("pixeleditor");
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
      // adds spaces between the controls' dom elements
      ...this.controls.reduce(
        (a, c) => a.concat(" ", c.dom), [])
      );
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}

// 1st control
class ToolSelect {
  constructor(state, {tools, dispatch}) {
    console.log("toolselect");
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
      // populates the select dropdown with the tools
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }
  syncState(state) { this.select.value = state.tool; }
}

// 2nd control
class ColorSelect {
  constructor(state, {dispatch}) {
    console.log("colorselect");
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  syncState(state) { this.input.value = state.color; }
}

//tools
function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}

// redrawn on the picture from the *original* state, so you can resize the rectangle and only have the last one get redrawn
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}

// a little similar to pathfinding code, but instead of finding a route through a graph, finds all "connected" pixels
const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill({x, y}, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          state.picture.pixel(x, y) == targetColor &&
          !drawn.some(p => p.x == x && p.y == y)) {
        drawn.push({x, y, color: state.color});
      }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}


function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}


class SaveButton {
  constructor(state) {
    console.log(savebutton);
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "💾 Save");
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) { this.picture = state.picture; }
}


class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "📁 Load");
  }
  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}


function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}


function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}


function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    });
  } else if (action.picture &&
             state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    });
  } else {
    return Object.assign({}, state, action);
  }
}


class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length == 0
    }, "⮪ Undo");
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}
