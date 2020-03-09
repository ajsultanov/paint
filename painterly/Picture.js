// trying to ... modularize

default export class Picture {
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
