import { TextCursor } from './config.js';
import { drawGrid } from '../chapter2/drawGrid.js';

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  drawingSurfaceImageData,
  blinkingInterval,
  BLINK_ON = 500,
  BLINK_OFF = 500,
  cursor = new TextCursor();

const blinkCursor = loc => {
  blinkingInterval = setInterval(() => {
    cursor.erase(context, drawingSurfaceImageData);
    setTimeout(e => {
      cursor.draw(context, cursor.left, cursor.top + cursor.getHeight(context))
    }, BLINK_OFF)
  }, 1000)
}
const saveDrawingSurface = () => {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  console.log(0, 0, canvas.width, canvas.height);
}
const moveCursor = loc => {
  cursor.erase(context, drawingSurfaceImageData);
  cursor.draw(context, loc.x, loc.y);
  if (!blinkingInterval) {
    blinkCursor(loc);
  }
}
const windowToCanvas = (x, y) => {
  let bbox = canvas.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
}

canvas.onmousedown = e => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  moveCursor(loc);
}
drawGrid(context, 'skyblue', 10, 10);
saveDrawingSurface();