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

const scale = 16;

const canvas = document.createElement('canvas');
canvas.width = canvasDiv.clientWidth - 10;
canvas.height = canvasDiv.clientHeight - 10;
const ctx = canvas.getContext('2d');
canvasDiv.appendChild(canvas);

let hex = ['00', '11', '22', '33',
					 '44', '55', '66', '77',
					 '88', '99', 'AA', 'BB',
					 'CC', 'DD', 'EE', 'FF']

for (let y = 0; y < 30; y++) {
	for (let x = 0; x < 40; x++) {
		ctx.fillStyle = '#' + hex[x] + hex[x+y] + hex[y];
		ctx.fillRect(x * scale, y * scale, scale, scale);
	}
}
