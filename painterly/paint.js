const contextMenu = document.querySelector('#contextMenu');
const createForm = document.querySelector('#create');
const scaleInput = document.querySelector('#scale');
const scaleRange = document.querySelector('#scaleRange');
const toolbar = document.querySelector('#toolbar');
const colorPalette = toolbar.querySelector('#colorPalette');
const color = colorPalette.querySelector('#color');
const primColor = color.querySelector('#color-1')
const secColor = color.querySelector('#color-2')
const palette = colorPalette.querySelector('#palette');
const paletteColors = Array.from(document.querySelectorAll('.pal-color'));
const optPaletteColors = Array.from(document.querySelectorAll('.pal-color.opt'));
const tools = toolbar.querySelectorAll('.tool');
const canvasDiv = document.querySelector('#canvas');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const canvasPos = {x:0, y:0, width:0, height:0};
canvasDiv.appendChild(canvas);

// let arr1 = [1,2,3], arr2 = [4,5,6]
//
// let arr3 = [...arr1]
// arr1.pop() 	//--> 3
// arr1 				//--> [1,2]
// arr3 				//--> [1,2,3]
//
// let [...arr4] = arr2
// arr2.pop() 	//--> 6
// arr2 				//--> [4,5]
// arr4 				//--> [4,5,6]
//
// ? ?? ??? huh ??? ?? ?

class Picture {
  constructor(width, height, pixels) {
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
let scale = 15;
scaleInput.value = scale;
scaleRange.value = scale;
let screenPicture = Picture.empty(24, 16, "#FFFFFF")
drawPicture(screenPicture, canvas, scale);


function windowResize() {
	paletteRefresh();
	canvasRefresh();
}
function paletteRefresh() {
	if (palette.offsetWidth < 130) {
		for (let color of optPaletteColors) {
			color.style.display = 'none';
		}
	} else {
		for (let color of optPaletteColors) {
			color.style.display = 'inline';
		}
	}
}
function canvasRefresh() {
	canvasPos.x = canvas.getBoundingClientRect().x;
	canvasPos.y = canvas.getBoundingClientRect().y;
	canvasPos.width = canvas.getBoundingClientRect().width;
	canvasPos.height = canvas.getBoundingClientRect().height;
}
paletteRefresh()
canvasRefresh()
window.addEventListener('resize', windowResize)

function brtCheck(color) {
	let brt = Number.parseInt(color.slice(0, 2), 16) + Number.parseInt(color.slice(2, 4), 16) + Number.parseInt(color.slice(4, 6), 16);
	return brt > 200 ? 1 : 0;
}

for (let color of paletteColors) {
	color.style.backgroundColor = `#${color.id}`;
	if (brtCheck(color.id)) {
		color.style.color = "#0004";
	} else {
		color.style.color = "#fff4";
	}
}

function setColor(e) {
	if (e.target.id === "palette") { return };

	if (e.button === 0 ){
		activeColor = `#${e.target.id}`;
		primColor.style.backgroundColor = activeColor;
		if (brtCheck(e.target.id)) {
			primColor.style.color = "#0008";
		} else {
			primColor.style.color = "#fff8";
		}
	} else if (e.button === 2) {
		e.preventDefault()
		secColor.style.backgroundColor = `#${e.target.id}`;
		if (brtCheck(e.target.id)) {
			secColor.style.color = "#0008";
		} else {
			secColor.style.color = "#fff8";
		}
	}
	console.log(`%cselected color: %c${e.target.id}`, "font-size:12px;color:black",`font-size:18px;color:${activeColor}`);
	return false;		// disables context menu from actually appearing
}
palette.addEventListener('click', setColor)
palette.addEventListener('contextmenu', setColor) // right click


const createCanvas = e => {
	e.preventDefault();
	if (document.activeElement.id === 'scale') { return };
	let pic = Picture.empty(e.target.width.value, e.target.height.value, '#FFFFFF');
	screenPicture = pic;
	console.log(pic);
	drawPicture(pic, canvas, scale)
	activeColor = "#" + Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
	console.log(`%c${activeColor}`, `font-size:18px;background-color:${activeColor};`);
}
createForm.addEventListener('submit', createCanvas)

const scaleChange = e => {
	if (screenPicture.width * screenPicture.height > 307200) {
		scaleInput.value = scale;
		scaleRange.value = scale;
		return;
	}
	scale = e.target.value;
	scaleInput.value = scale;
	scaleRange.value = scale;
	console.log(screenPicture.width * screenPicture.height * scale);
	console.log(`%cscale: ${scale}x`, `font-size:${scale/1.5+5}px;`, );
	drawPicture(screenPicture, canvas, scale)
}
scaleInput.addEventListener('change', scaleChange)
scaleRange.addEventListener('change', scaleChange)

let activeColor = "#" + Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
console.log(`%c${activeColor}`, `font-size:18px;background-color:${activeColor};`);

let mousePos = {x:0, y:0};
function mouseMovin(e) {
	mousePos.x = e.clientX;
	mousePos.y = e.clientY;
}
document.addEventListener('mousemove', mouseMovin);
canvas.addEventListener('mousedown', drawPixel);

let key = null;
let keyInput = e => {
	console.log(this);
	key = e.key;

	switch (e.key) {
		case 'w':
			e => drawpixel(e);
			break;
		default: null;
	}
}
document.addEventListener('keydown', e => {
	if (e.key !== key) { keyInput(e) };
});
document.addEventListener('keyup', () => key = null);


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

function drawPixel(e) {
	console.time('draw');
	// if (e.type === "keydown") { key = e.key };
// 												get mouseEvent coordinate
// 												OR
//												for keyboardEvent:
//   		*		*									client position of mouse
// 			\__/								+ amount of canvas element scroll
//													+ amount of window scroll
// 													- canvas element position
//												i havent thought this through immensely but it works

	let coordX = Math.floor((e.offsetX || mousePos.x + canvasDiv.scrollLeft + window.scrollX - canvasPos.x) / scale);
	let coordY = Math.floor((e.offsetY || mousePos.y + canvasDiv.scrollTop + window.scrollY - canvasPos.y) / scale);

	// makes it so a coordX value above the width doesnt simply go down to the next line
	if (
			coordX >= screenPicture.width
	||	mousePos.x < canvasPos.x
	||	coordY >= screenPicture.height
	||	mousePos.y < canvasPos.y
	) {
		console.log("%c Outta Bounds", "color: #f00; font-size:24px; text-shadow:1px 1px 2px #80f; font-family:Futura");
		console.log({ox:mousePos.x, oy:mousePos.y, cx:canvasPos.x, cy:canvasPos.y});
		return;
	}

	let pixelIndex = screenPicture.width * coordY + coordX
	let pixelInQuestion = screenPicture.pixels[pixelIndex]

	console.log(
		`${mousePos.x + canvasDiv.scrollLeft + window.scrollX - canvasPos.x}\t/ ${scale} =\t${coordX},\n${mousePos.y + canvasDiv.scrollTop + window.scrollY - canvasPos.y}\t/ ${scale} =\t${coordY}`);
	console.log(`x:${coordX} + y:${coordY * screenPicture.width} (${coordY} * ${screenPicture.width}) = ${pixelIndex}`);

	if (pixelInQuestion === "#FFFFFF") {
		screenPicture.pixels[pixelIndex] = activeColor;
	} else {
		screenPicture.pixels[pixelIndex] = "#FFFFFF";
	}
	drawPicture(screenPicture, canvas, scale);
	console.timeEnd('draw');
}




// create array of hex color values
// let colorArr = Array.from(new Array(64), x => Math.floor(Math.random() * 4096).toString(16).padStart(3, "0"));
// let a = [], b = [], c = [];
// colorArr.forEach(x => {
// 	a.push(parseInt(x[0], 16));
// 	b.push(parseInt(x[1], 16));
// 	c.push(parseInt(x[2], 16));
// })
//
// console.log(colorArr);
// console.log(Math.round(a.reduce((a = 0, c) => a += c)/64));
// console.log(Math.round(b.reduce((a = 0, c) => a += c)/64));
// console.log(Math.round(c.reduce((a = 0, c) => a += c)/64));

// fill canvas with random color pixels
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
