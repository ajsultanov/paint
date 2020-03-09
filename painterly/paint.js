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
const hex = document.querySelector('#hex');
const hexInput = hex.querySelector('#hexInput');
const hsl = document.querySelector('#hsl');
const hueRange = hsl.querySelector('#hueRange');
const hueNum = hsl.querySelector('#hueNum');
const satNum = hsl.querySelector('#satNum');
const lightNum = hsl.querySelector('#lightNum');
const satRange = hsl.querySelector('#satRange');
const lightRange = hsl.querySelector('#lightRange');
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
let scale = 25;
scaleInput.value = scale;
scaleRange.value = scale;
let screenPicture = Picture.empty(24, 16, "#FFFFFF")
let history = []


//  //
//
//  //
//
//

//  //
//
//  //

//

//  //
//
//

//
//
//

//

const createCanvas = (width, height) => {

  // console.log(e);
	if (document.activeElement.id === 'scale') { return };
	screenPicture = Picture.empty(width, height, '#FFFFFF');
  // add(history, screenPicture)
  history = [];
  history.unshift(new Picture(screenPicture.width, screenPicture.height, screenPicture.pixels));
	drawPicture(screenPicture, canvas, scale);
  console.log(history);
	// activeColor = "#" + Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
	//console.log(`%c${activeColor}`, `font-size:18px;background-color:${activeColor};`);
}
createForm.addEventListener('submit', e => {
  e.preventDefault();
  let width = parseInt(e.target.width.value, 10);
  let height = parseInt(e.target.height.value, 10);
  createCanvas(width, height)
})


// add(history, screenPicture);
createCanvas(24, 16);
// drawPicture(screenPicture, canvas, scale);

function windowResize() {
  console.log("windowResize");
	paletteRefresh();
	canvasRefresh();
}
function paletteRefresh() {
  console.log("paletteRefresh");
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
  console.log("canvasRefresh");
	canvasPos.x = canvas.getBoundingClientRect().x;
	canvasPos.y = canvas.getBoundingClientRect().y;
	canvasPos.width = canvas.getBoundingClientRect().width;
	canvasPos.height = canvas.getBoundingClientRect().height;
}
paletteRefresh()
canvasRefresh()
window.addEventListener('resize', windowResize)

function brtCheck(color) {
  console.log("brtCheck");
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
  console.log("setColor");
	if (e.target.id === "palette") { return };

  if (e.target.className.match(/pal-color/)) {
  	if (e.button === 0 ){
  		activeColor = `#${e.target.id}`;
  		// primColor.style.backgroundColor = activeColor;
      colorRefresh()

  		if (brtCheck(e.target.id)) {
  			primColor.style.color = "#0008";
  		} else {
  			primColor.style.color = "#fff8";
  		}
  	} else if (e.button === 2) {
  		// e.preventDefault()
      backColor = `#${e.target.id}`;
  		// secColor.style.backgroundColor = `#${e.target.id}`;
      colorRefresh();

  		if (brtCheck(e.target.id)) {
  			secColor.style.color = "#0008";
  		} else {
  			secColor.style.color = "#fff8";
  		}
  	}
  }
	//console.log(`%cselected color: %c${e.target.id}`, "font-size:12px;color:black",`font-size:18px;color:${activeColor}`);

  hexInput.value = activeColor.slice(1);
  const {HUE, SAT, LIGHT} = getHSL(activeColor);
  hueRange.value = HUE;
  satRange.value = SAT * 100;
  lightRange.value = LIGHT * 100;
  hueNum.innerText = `${Math.round(HUE)}`;
  satNum.innerText = `${Math.round(SAT * 100, 2)}`;
  lightNum.innerText = `${Math.round(LIGHT * 100)}`

	return false;		// disables context menu from actually appearing
}
palette.addEventListener('click', setColor)
palette.addEventListener('contextmenu', setColor) // right click

function setByHSL(e) {
  activeColor = getRGB({HUE: hueRange.value, SAT: satRange.value/100, LIGHT: lightRange.value/100});
  colorRefresh();

  hexInput.value = activeColor.slice(1);
  const {HUE, SAT, LIGHT} = getHSL(activeColor);
  hueRange.value = HUE;
  satRange.value = SAT * 100;
  lightRange.value = LIGHT * 100;
  hueNum.innerText = `${Math.round(HUE)}`;
  satNum.innerText = `${Math.round(SAT * 100, 2)}`;
  lightNum.innerText = `${Math.round(LIGHT * 100)}`
}
hsl.addEventListener('change', setByHSL)

function getHSL(hex) {
  console.log('getHSL');
  if (hex[0] === '#') { hex = hex.slice(1) }

  let red = parseInt(hex.slice(0, 2), 16)/255;
  let grn = parseInt(hex.slice(2, 4), 16)/255;
  let blu = parseInt(hex.slice(4, 6), 16)/255;
  // console.log(red, grn, blu);
  let max = Math.max(red, grn, blu);
  let min = Math.min(red, grn, blu);
  let delta = max - min;
  let total = max + min;
  let totalFromTwo = 2 - total;
  let lightness = (total / 2);

  let saturation = 0;
  let hue = 0;
  let maxColor = "";
  if (delta !== 0) {
    if (lightness < .5) {
      saturation = delta / total;
    }
    else {
      saturation = delta / totalFromTwo;
    }

    if (Math.max(red, grn, blu) === red) {
      maxColor = "red";
      hue = ((grn - blu) / delta) * 60;
    }
    else if (Math.max(red, grn, blu) === grn) {
      maxColor = "green";
      hue = (2 + (blu - red) / delta) * 60;
    }
    else if (Math.max(red, grn, blu) === blu){
      maxColor = "blue";
      hue = (4 + (red - grn) / delta) * 60;
    }
    else { console.log("uh oh") }
  }

  if (hue < 0) {
    hue += 360;
  }
  if (hue > 15 && hue < 25) { maxColor = "orange" }
  if (hue > 45 && hue < 75) { maxColor = "yellow" }
  if (hue > 165 && hue < 195) { maxColor = "cyan" }
  if (hue > 255 && hue < 295) { maxColor = "purple" }
  if (hue > 295 && hue < 335) { maxColor = "pink" }
  console.log('hue:', hue.toFixed(0), `(${maxColor})`);
  console.log('sat:', saturation.toFixed(2));
  console.log('light:', lightness.toFixed(2));
  return(
    {
      HUE: Number.parseFloat(hue.toFixed(0)),
      SAT: Number.parseFloat(saturation.toFixed(2)),
      LIGHT: Number.parseFloat(lightness.toFixed(2))
    }
  );
}
function getRGB(hsl) {

  const HUE = hsl.HUE;
  const SAT = hsl.SAT;
  const LIGHT = hsl.LIGHT;
  // console.log("hue:", HUE, "sat:", SAT, "light:", LIGHT);

  let red = 0;
  let grn = 0;
  let blu = 0;

  // from niwa
  // http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
  let tempVar1;
  let huePerc = HUE / 360;

  if (SAT === 0) {
    red = Math.round(255 * LIGHT);
    grn = Math.round(255 * LIGHT);
    blu = Math.round(255 * LIGHT);
  }
  if (LIGHT < .5) {
    tempVar1 = LIGHT * (1 + SAT)
  }
  else {
    tempVar1 = LIGHT + SAT - LIGHT * SAT
  }
  let tempVar2 = 2 * LIGHT - tempVar1;
  // console.log("temps:", tempVar1, tempVar2);
  let tempRed = huePerc + 1/3;
  let tempGrn = huePerc;
  let tempBlu = huePerc - 1/3;
  // console.log("tempColors:", tempRed, tempGrn, tempBlu);

  function convert(tempColor) {
    let color;
    if (tempColor < 0) {
      tempColor += 1;
    }
    else if (tempColor > 1) {
      tempColor -= 1;
    }
    if (6 * tempColor < 1) {
      color = tempVar2 + (tempVar1 - tempVar2) * 6 * tempColor;
    }
    else if (2 * tempColor < 1) {
      color = tempVar1;
    }
    else if (3 * tempColor < 2) {
      color = tempVar2 + (tempVar1 - tempVar2) * (2/3 - tempColor) * 6;
    }
    else { color = tempVar2 }
    // console.log("color:", color.toFixed(2));
    return Math.round(color * 255);
  }
  red = convert(tempRed);
  grn = convert(tempGrn);
  blu = convert(tempBlu);

  console.log("red:", red, "green:", grn, "blue:", blu);

  red = red.toString(16).padStart(2, "0");
  grn = grn.toString(16).padStart(2, "0");
  blu = blu.toString(16).padStart(2, "0");

  rgb = ['#', red, grn, blu].join('')
  return rgb;
}

function setByHex(e) {
  console.log("setByHex");

  let hex = e.target.value;
  if (hex.length < 6) {
    hex = hex.padEnd(6, "0")
  }
  else if (hex.length > 6) {
    hex = hex.slice(0, 6)
  }
  activeColor = `#${hex}`;
  hexInput.value = hex;
  colorRefresh();
};
hexInput.addEventListener('change', setByHex);


function colorRefresh() {
  console.log("colorRefresh");
  primColor.style.backgroundColor = activeColor;
  secColor.style.backgroundColor = backColor;

  // HMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
  // not incredibly...robust

  let buffColor = [activeColor[1], activeColor[1], activeColor[2], activeColor[2], activeColor[3], activeColor[3]].join("");
  if (brtCheck(buffColor)) {
    // console.log("BRITEE");
    primColor.style.color = "#0008";
  } else {
    // console.log("NOBRITEE");
    primColor.style.color = "#fff8";
  }

  let buffColor2 = [backColor[1], backColor[1], backColor[2], backColor[2], backColor[3], backColor[3]].join("");
  if (brtCheck(buffColor2)) {
    // console.log("BRITEE");
    secColor.style.color = "#0008";
  } else {
    // console.log("NOBRITEE");
    secColor.style.color = "#fff8";
  }

  hexInput.value = activeColor.slice(1);
}



const scaleChange = e => {

  console.log(e);

  // ***too big***
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

let activeColor = "#" +
  Math.floor(Math.random() * 4096).toString(16).padStart(3, "0") +
  Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
//console.log(`%c${activeColor}`, `font-size:18px;background-color:${activeColor};`);
let backColor = "#" +
  Math.floor(Math.random() * 4096).toString(16).padStart(3, "0") +
  Math.floor(Math.random() * 4096).toString(16).padStart(3, "0");
colorRefresh();
const {HUE, SAT, LIGHT} = getHSL(activeColor);
hueRange.value = HUE;
satRange.value = SAT * 100;
lightRange.value = LIGHT * 100;
hueNum.innerText = `${Math.round(HUE)}`;
satNum.innerText = `${Math.round(SAT * 100, 2)}`;
lightNum.innerText = `${Math.round(LIGHT * 100)}`
hexInput.value = activeColor.slice(1);
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
  console.log("drawPicture");
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

function addToHistory() {
  if (history.length > 10){
    history.pop()
  }
  history.unshift(new Picture(screenPicture.width, screenPicture.height, Array.from(screenPicture.pixels)));
}





function drawPixel(pixelIndex) {
  console.log("drawPixel");
  console.log(history);
  if (screenPicture.pixels[pixelIndex] === activeColor) { return };
  addToHistory()
	// console.time('draw');
  console.log(history);
	screenPicture.pixels[pixelIndex] = activeColor;
  // console.log(pixelIndex);
	drawPicture(screenPicture, canvas, scale);
	// console.timeEnd('draw');
}
function erasePixel(pixelIndex) {
  console.log("erasePixel");
  addToHistory()
  if (screenPicture.pixels[pixelIndex] === '#FFFFFF') { return };
  // console.time('erase');
  screenPicture.pixels[pixelIndex] = "#FFFFFF";
  drawPicture(screenPicture, canvas, scale);
  // console.timeEnd('erase');
}
function drawLine() {

}
function drawRect() {

}

function fillSpace(pixelIndex) {
  console.log("fillSpace");
  addToHistory()
  if (screenPicture.pixels[pixelIndex] === activeColor) { return };
  // console.time("fill");
  let targetColor = screenPicture.pixels[pixelIndex];
  floodFill(pixelIndex, targetColor, activeColor);
  drawPicture(screenPicture, canvas, scale);
  // console.timeEnd("fill");
}
function floodFill(index, target, active) {
  let yStep = screenPicture.width;
  if (index % (yStep - 1) === -1) { return }
  else if (target === active) { return }
  else if (screenPicture.pixels[index] !== target) { return }

  // logic here to return if crossing border pixel

  // if ((index + 1) % (yStep) === 1 && index !== 1) { --index } ?
  // else if (index % yStep === yStep) { ++index } ?

  else { screenPicture.pixels[index] = active };
  floodFill(index + yStep, target, active);
  floodFill(index - yStep, target, active);
  floodFill(index + 1, target, active);
  floodFill(index - 1, target, active);
  return;
}

function marquee() {

}
function lasso() {

}
function wand() {

}
function selectionBrush() {

}
function superWand() {
  // cross between wand and selectionBrush
}

function getColor(pixelIndex) {
  console.log("getColor");
  activeColor = screenPicture.pixels[pixelIndex];
  colorRefresh();
  const {HUE, SAT, LIGHT} = getHSL(activeColor);
  hueRange.value = HUE;
  satRange.value = SAT * 100;
  lightRange.value = LIGHT * 100;
  hueNum.innerText = `${Math.round(HUE)}`;
  satNum.innerText = `${Math.round(SAT * 100, 2)}`;
  lightNum.innerText = `${Math.round(LIGHT * 100)}`
}
function colorSwap() {
  console.log("colorSwap");
  let buffer = activeColor;
  activeColor = backColor;
  backColor = buffer;
  console.log(activeColor, backColor, buffer);
  colorRefresh();
}

function undo() {
  console.log("undo");
  if (history.length > 0){ screenPicture = history.shift() }
  drawPicture(screenPicture, canvas, scale);
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
const utilityKeys = ['z', 'x']
// keydown event handler
function keyHandler(e) {
  console.log("keyHandler");
  key = e.key;
  if (utilityKeys.includes(key)) { keySwitcher(key, -1) };
  heldDown = true;

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
  console.log("keySwitcher");
  switch(key) {
//  draw
    case 'w':
      drawPixel(pixelIndex);
      break;
//    set pixels[pixelIndex] to activeColor
//  erase
    case 'a':
      // console.log("erase");
      erasePixel(pixelIndex);
      break;
//    set pixels[pixelIndex] to FFF
//  fill
    case 'f':
      // console.log("fill");
      fillSpace(pixelIndex);
      break;
//  line
//    save origin
//    redraw on mousemove
//    set on keyup
//  sample
    case 'q':
      // console.log("dropper");
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
    case 'x':
      // console.log("swap");
      colorSwap();
      break;
    case 'z':
      // console.log("undo");
      undo();
      break;

    default:
      console.log('key:', key);
      return null;
  }
}
