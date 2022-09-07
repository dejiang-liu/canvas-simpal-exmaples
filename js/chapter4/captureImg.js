let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),

  resetButton = document.getElementById('resetButton'),

  image = new Image(),
  imageData,

  mousedown = {},
  rubberbandRectangle = {},
  dragging = false;

const windowToCanvas = (x, y) => {
  let canvasRectangle = canvas.getBoundingClientRect();
  return {
    x: x - canvasRectangle.left,
    y: y - canvasRectangle.top
  }
}
const captureRubberbandPixels = () => {
  imageData = context.getImageData(rubberbandRectangle.left, rubberbandRectangle.top, rubberbandRectangle.width, rubberbandRectangle.height);
}

const restoreRubberbandPixels = () => {
  context.putImageData(imageData, rubberbandRectangle.left, rubberbandRectangle.top);
}

const drawRubberband = () => {
  context.strokeRect(rubberbandRectangle.left + context.lineWidth,
    rubberbandRectangle.top + context.lineWidth,
    rubberbandRectangle.width - 2 * context.lineWidth,
    rubberbandRectangle.height - 2 * context.lineWidth);
}

const setRubberbandRectangle = (x, y) => {
  rubberbandRectangle.left = Math.min(x, mousedown.x);
  rubberbandRectangle.top = Math.min(y, mousedown.y);
  rubberbandRectangle.width = Math.abs(x - mousedown.x);
  rubberbandRectangle.height = Math.abs(y - mousedown.y);
}

const updateRubberband = () => {
  captureRubberbandPixels();
  drawRubberband();
}
const rubberbandStart = (x, y) => {
  mousedown.x = x;
  mousedown.y = y;
  rubberbandRectangle.left = mousedown.x;
  rubberbandRectangle.top = mousedown.y;
  dragging = true;
}
const rubberbandStretch = (x, y) => {
  if (rubberbandRectangle.width > 2 * context.lineWidth &&
    rubberbandRectangle.height > 2 * context.lineWidth) {
    if (imageData !== undefined) {
      restoreRubberbandPixels();
    }
  }
  setRubberbandRectangle(x, y);
  if (rubberbandRectangle.width > 2 * context.lineWidth &&
    rubberbandRectangle.height > 2 * context.lineWidth) {
    updateRubberband();
  }
}
const rubberbandEnd = () => {
  context.drawImage(canvas,
    rubberbandRectangle.left + context.lineWidth * 2,
    rubberbandRectangle.top + context.lineWidth * 2,
    rubberbandRectangle.width - 4 * context.lineWidth,
    rubberbandRectangle.height - 4 * context.lineWidth,
    0, 0, canvas.width, canvas.height);
  dragging = false;
  imageData = undefined;
}

canvas.onmousedown = e => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  e.preventDefault();
  rubberbandStart(loc.x, loc.y);
}

canvas.onmousemove = e => {
  let loc;
  if (dragging) {
    loc = windowToCanvas(e.clientX, e.clientY);
    rubberbandStretch(loc.x, loc.y);
  }
}

canvas.onmouseup = e => {
  rubberbandEnd();
}
image.src = '../../assets/logo.jpg';
image.onload = () => {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}
resetButton.onclick = e => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}
context.strokeStyle = 'navy';
context.lineWidth = 1.0;