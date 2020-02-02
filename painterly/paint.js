const toolbar = document.querySelector('#toolbar');
const colorPalette = toolbar.querySelector('#colorPalette');
const color = colorPalette.querySelector('#color')
const palette = colorPalette.querySelector('#palette')
const tools = toolbar.querySelectorAll('.tool')
const contextMenu = document.querySelector('#contextMenu');
const canvasDiv = document.querySelector('#canvas')

console.dir(toolbar);
console.dir(colorPalette);
console.dir(color);
console.dir(palette);
console.dir(tools);
console.dir(contextMenu);
console.dir(canvasDiv);

class Picture {
  constructor(width, height, pixels) {
    console.log("picture");
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

	// returns value at particular pixel location
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  // for updating many pixels at once
	// takes an array of objects { x:x, y:y, color:color}
  draw(pixels) {
    let copy = this.pixels.slice(); // Pictures pixels
    //        ?  ? where do these come from
    for (let {x, y, color} of pixels) { // arguments pixels
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

// make a controlled input with SCALE(zoom) variable

const scale = 15;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// canvas.width = canvasDiv.clientWidth - 10;
// canvas.height = canvasDiv.clientHeight - 10;
canvas.setAttribute('onclick', onMouseDown)				// <-- this doesnt work
canvasDiv.appendChild(canvas);

function onMouseDown(e) {												 // <-- this doesnt work
	console.log(canvas);
}


// this component has two responsibilities: 1.displaying the picture as a grid of colored boxes and 2.communicating pointer events from this picture
// cannot directly dispatch actions as it does not know the whole application state, only the current picture
class PictureCanvas {
  constructor(picture, pointerDown) {
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    // only redraws when given a new picture
    this.picture = picture;
    drawPicture(this.picture, canvas, scale);
  }
}

function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  // CanvasRenderingContext2D
  let cx = canvas.getContext('2d');

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}








// let hex = ['00', '11', '22', '33',
// 					 '44', '55', '66', '77',
// 					 '88', '99', 'AA', 'BB',
// 					 'CC', 'DD', 'EE', 'FF']
// // fun!
// for (let y = 0; y < 30; y++) {
// 	for (let x = 0; x < 40; x++) {
// 		ctx.fillStyle = '#' +
// 		hex[Math.floor(Math.random() * (15 - 1) + 1)] +
// 		hex[Math.floor(Math.random() * (15 - 3) + 3)] +
// 		hex[Math.floor(Math.random() * (15 - 5) + 5)];
// 		ctx.fillRect(x * scale, y * scale, scale, scale);
// 	}
// }
