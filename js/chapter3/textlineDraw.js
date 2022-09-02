import { TextCursor, TextLine } from "./config.js";
// import { drawBackground } from "./textStrokeAndFill.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),

  // fontSelect = document.getElementById('fontSelect'),
  sizeSelect = document.getElementById('sizeSelect'),
  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
  fillStyleSelect = document.getElementById('fillStyleSelect'),

  GRID_STROKE_STYLE = 'lightgray',
  GRID_HORIZONTAL_SPACING = 10,
  GRID_VERTICAL_SPACING = 10,

  cursor = new TextCursor(),
  line,
  blinkingInterval,
  drawingSurfaceImageData,
  BLINK_TIME = 1000,
  BLINK_OFF = 300;

const windowToCanvas = (x, y) => {
  let bbox = canvas.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
}
const saveDrawingSurface = () => {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

const setFont = () => {
  cursor.font = sizeSelect.value + 'px Arial';
  context.font = sizeSelect.value + 'px Arial';
}
const blinkCursor = (x, y) => {
  clearInterval(blinkingInterval);
  blinkingInterval = setInterval(() => {
    cursor.erase(context, drawingSurfaceImageData);
    setTimeout(() => {
      if (cursor.left == x && cursor.top + cursor.getHeight(context) == y) {
        cursor.draw(context, x, y);
      }
    }, 300)
  }, 1000);
}
const moveCursor = (x, y) => {
  cursor.erase(context, drawingSurfaceImageData);
  saveDrawingSurface();
  context.putImageData(drawingSurfaceImageData, 0, 0);
  cursor.draw(context, x, y);
  blinkCursor(x, y);
}

canvas.onmousedown = e => {
  let loc = windowToCanvas(e.clientX, e.clientY),
    fontHeight = context.measureText('W').width;
  fontHeight += fontHeight / 6;
  line = new TextLine(loc.x, loc.y);
  moveCursor(loc.x, loc.y);
}

fillStyleSelect.onchange = e => {
  cursor.fillStyle = fillStyleSelect.value;
  context.fillStyle = fillStyleSelect.value;
}
strokeStyleSelect.onchange = e => {
  cursor.strokeStyle = strokeStyleSelect.value;
  context.strokeStyle = strokeStyleSelect.value;
}

document.onkeydown = e => {
  if (e.keyCode ===8 || e.keyCode === 13) {
    e.preventDefault();
  }
  if (e.keyCode === 8) {
    context.save();
    line.erase(context, drawingSurfaceImageData);
    line.removeCharacterBeforeCaret();
    moveCursor(line.left + line.getWidth(context), line.bottom);
    line.draw(context);
    context.restore();
  }
}
document.onkeypress = e => {
  let key = String.fromCharCode(e.which);
  if (e.keyCode !== 8 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    context.save();
    line.erase(context, drawingSurfaceImageData);
    line.insert(key);
    moveCursor(line.left + line.getWidth(context), line.bottom);
    context.shadowColor = 'rgba(0, 0, 0, 0.5)';
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowBlur = 2;
    line.draw(context);
    context.restore();
  }
}
sizeSelect.onchange = e => {
  setFont();
}

cursor.fillStyle = fillStyleSelect.value;
cursor.strokeStyle = strokeStyleSelect.value;
context.fillStyle = fillStyleSelect.value;
context.lineWidth = 2.0;

setFont();
// drawBackground(context);
saveDrawingSurface();