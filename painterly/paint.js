const contextMenu = document.querySelector('#contextMenu');
const createForm = document.querySelector('#create');
const scaleInput = document.querySelector('#scaleInput');
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

// let arr1 = [1,2,3], arr3 = [4,5,6], arr5 = [7,8,9]
//
// let arr2 = [...arr1]
// arr1.pop() 	//--> 3
// arr1 				//--> [1,2]
// arr2 				//--> [1,2,3]
//
// let [...arr4] = arr3
// arr3.pop() 	//--> 6
// arr3 				//--> [4,5]
// arr4 				//--> [4,5,6]
//
// let [...arr6] = [...arr5]
// arr5.pop() 	//--> 9
// arr5 				//--> [7,8]
// arr6 				//--> [7,8,9]
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
	//console.log(`%cselected color: %c${e.target.id}`, "font-size:12px;color:black",`font-size:18px;color:${activeColor}`);
	return false;		// disables context menu from actually appearing
}
palette.addEventListener('click', setColor)
palette.addEventListener('contextmenu', setColor) // right click


const createCanvas = e => {
	e.preventDefault();
	if (document.activeElement.id === 'scale') { return };
	let pic = Picture.empty(e.target.width.value, e.target.height.value, '#FFFFFF');
	screenPicture = pic;
	//console.log(pic);
	drawPicture(pic, canvas, scale)
	activeColor = "#" + Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
	//console.log(`%c${activeColor}`, `font-size:18px;background-color:${activeColor};`);
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
	//console.log(screenPicture.width * screenPicture.height * scale);
	//console.log(`%cscale: ${scale}x`, `font-size:${scale/1.5+5}px;`, );
	drawPicture(screenPicture, canvas, scale)
}
scaleInput.addEventListener('change', scaleChange)
scaleRange.addEventListener('change', scaleChange)

let activeColor = "#" + Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
//console.log(`%c${activeColor}`, `font-size:18px;background-color:${activeColor};`);

//
//
//
//
//

//
//
//
//
  ////

//  //

//  //
//
//

//  //
    //
////

//  //
//
//
//
//  //

//  //

//  //

//  //
//
//  //
//
//

//
//
//

//  //

//  //
//
//

//  //
//
//  //

//

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

//
//
//  //

//  //

//  //
//
//  //

//  //
//
//

//  //
//
//
//
//

function drawPixel(pixelIndex) {
  if (screenPicture.pixels[pixelIndex] === activeColor) { return };
	console.time('draw');
	screenPicture.pixels[pixelIndex] = activeColor;
	drawPicture(screenPicture, canvas, scale);
	console.timeEnd('draw');
}
function erasePixel(pixelIndex) {
  if (screenPicture.pixels[pixelIndex] === '#FFFFFF') { return };
  console.time('erase');
  screenPicture.pixels[pixelIndex] = "#FFFFFF";
  drawPicture(screenPicture, canvas, scale);
  console.timeEnd('erase');
}
function fillSpace(pixelIndex) {
  if (screenPicture.pixels[pixelIndex] === activeColor) { return };
  console.time("fill");
  let targetColor = screenPicture.pixels[pixelIndex];
  floodFill(pixelIndex, targetColor, activeColor);
  drawPicture(screenPicture, canvas, scale);
  console.timeEnd("fill");
}
function floodFill(index, target, active) {
  let yStep = screenPicture.width;
  if (index % (yStep - 1) === -1) { return }
  if (target === active) { return }
  else if (screenPicture.pixels[index] !== target) { return }
  else { screenPicture.pixels[index] = active }
  floodFill(index + yStep, target, active);
  floodFill(index - yStep, target, active);
  floodFill(index + 1, target, active);
  floodFill(index - 1, target, active);
  return;
}
function getColor(pixelIndex) {
  activeColor = screenPicture.pixels[pixelIndex];
  primColor.style.backgroundColor = activeColor;
}



// fun weird palette stuff

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


//
//
//  //

//

//  //
//
//
//
//


//  //
//
//  //
//
//

//
//
//

//  //
//
//  //

//  //


//  //

//  //
//
//  //

//  //
//
//  //

//  //

//
//
//
//
  ////

//  //
//
//
//
//

let mousePos = {x:0, y:0};
let key = null;
let heldDown = false;
let lastKey = null;
let lastPixelIndex = null;
document.addEventListener('keydown', e => {
  keyHandler(e);
});
// keydown event handler
function keyHandler(e) {
  heldDown = true;
  key = e.key;
//  get position
  let coordX = Math.floor((e.offsetX || mousePos.x + canvasDiv.scrollLeft + window.scrollX - canvasPos.x) / scale);
	let coordY = Math.floor((e.offsetY || mousePos.y + canvasDiv.scrollTop + window.scrollY - canvasPos.y) / scale);
//  check if in canvas bounds
  if (
			coordX >= screenPicture.width
	||	mousePos.x < canvasPos.x
	||	coordY >= screenPicture.height
	||	mousePos.y < canvasPos.y
  ) {
    console.log("o.o.b.");
    return;
  };
  let pixelIndex = screenPicture.width * coordY + coordX;
  if (pixelIndex === lastPixelIndex) {
// if position hasn't changed, check if key is different
    if (key === lastKey) { return }
    else {
      lastPixelIndex = pixelIndex;
      lastKey = key;
      keySwitcher(key, pixelIndex);
    }
  } else {
    lastPixelIndex = pixelIndex;
    lastKey = key;
    keySwitcher(key, pixelIndex);
  }
};
// keyup event handler
document.addEventListener('keyup', () => {
  key = null;
  heldDown = false;
});
// mouseleave event handler
canvas.addEventListener('mouseleave', () => {
  key = null;
  heldDown = false;
});
// mousemove event handler
canvas.addEventListener('mousemove', e => {
  mousePos.x = e.clientX;
	mousePos.y = e.clientY;
  if (!heldDown) { return };
  let coordX = Math.floor((e.offsetX || mousePos.x + canvasDiv.scrollLeft + window.scrollX - canvasPos.x) / scale);
	let coordY = Math.floor((e.offsetY || mousePos.y + canvasDiv.scrollTop + window.scrollY - canvasPos.y) / scale);
  let pixelIndex = screenPicture.width * coordY + coordX;
  if (pixelIndex !== lastPixelIndex) {
    lastPixelIndex = pixelIndex;
    keySwitcher(lastKey, pixelIndex);
  }
});
//  check heldDown
//    false: return
//  get position
//  check if inbounds
//  determine pixelIndex
//  check against lastPixelIndex
//    same: return
//    diff: save and continue

function keySwitcher(key, pixelIndex) {
  switch(key) {
//  draw
    case 'w':
      drawPixel(pixelIndex);
      break;
//    set pixels[pixelIndex] to activeColor
//  erase
    case 'a':
      erasePixel(pixelIndex);
      break;
//    set pixels[pixelIndex] to FFF
//  fill
    case 'f':
      fillSpace(pixelIndex);
      break;
//  line
//    save origin
//    redraw on mousemove
//    set on keyup
//  sample
    case 'q':
      getColor(pixelIndex);
      break;
//    set activeColor
//  square
//    save origin
//    redraw on mousemove
//    set on keyup
//  marquee...
//    hmm
//  undo...
//    hmm
    default:
      console.log('key:', key);
      return null;
  }
}
