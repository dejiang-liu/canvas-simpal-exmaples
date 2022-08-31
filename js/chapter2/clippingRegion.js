import { drawGrid } from "./drawGrid.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
  fillStyleSelect = document.getElementById('fillStyleSelect'),
  drawRadio = document.getElementById('drawRadio'),
  eraserRadio = document.getElementById('eraserRadio'),
  eraserShapeSelect = document.getElementById('eraserShapeSelect'),
  eraserWidthSelect = document.getElementById('eraserWidthSelect'),

  ERASER_LINE_WIDTH = 1,
  ERASET_SHADOW_COLOR = '#000',

  ERASER_SHADOW_STYLE = 'blue',
  ERASER_STROKE_STYLE = 'rgba(0, 0, 255)',
  ERASER_SHADOW_OFFSET = -5,
  ERASER_SHADOW_BLUR = 20,

  GRID_HORIZONTAL_SPACING = 10,
  GRID_VERTICAL_SPACING = 10,
  GRID_LINE_COLOR = 'skyblue',
  drawingSurfaceImageData,

  lastX,
  lastY,
  mousedown = {},
  rubberbandRect = {},
  dragging = false,
  guidewires = true;

//* common fn
const windowToCanvas = (x, y) => {
  let bbox = canvas.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
}
// save and restore drawing surface ...
const saveDrawingSurface = () => {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height)
}
const restoreDrawingSurface = () => {
  context.putImageData(drawingSurfaceImageData, 0, 0)
}
// Rubber bands
const updateRubberBandRectangle = (loc) => {
  rubberbandRect.width = Math.abs(loc.x - mousedown.x);
  rubberbandRect.height = Math.abs(loc.y - mousedown.y);
  rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
  rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}

const drawRubberbandShape = loc => {
  let angle = Math.atan(rubberbandRect.height / rubberbandRect.width),
    radius = rubberbandRect.height / Math.sin(angle);
  if (mousedown.y == loc.y) {
    radius = Math.abs(loc.x - mousedown.x)
  }
  context.beginPath();
  context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, false);
  context.stroke();
  context.fill();
}

const updateRubberband = loc => {
  updateRubberBandRectangle(loc);
  drawRubberbandShape(loc);
}

const setDrawPathForEraser = loc => {
  let eraserWidth = parseFloat(eraserWidthSelect.value);
  context.beginPath();
  eraserShapeSelect.value === 'circle' ?
    context.arc(loc.x, loc.y, eraserWidth / 2, 0, Math.PI, false) :
    context.rect(loc.x - eraserWidth / 2, loc.y - eraserWidth / 2, eraserWidth, eraserWidth);
  context.clip();
}
const setErasePathForEraser = () => {
  let eraserWidth = parseFloat(eraserWidthSelect.value);
  context.beginPath();
  eraserShapeSelect.value === 'circle' ?
    context.arc(lastX, lastY, eraserWidth / 2 + ERASER_LINE_WIDTH, 0, false) :
    context.rect(lastX - eraserWidth / 2 - ERASER_LINE_WIDTH, lastY - eraserWidth / 2 - ERASER_LINE_WIDTH, eraserWidth + ERASER_LINE_WIDTH * 2, eraserWidth + ERASER_LINE_WIDTH * 2);
  context.clip();
}
const setEraserAttributes = () => {
  context.lineWidth = ERASER_LINE_WIDTH;
  context.shadowColor = ERASER_SHADOW_STYLE;
  context.shadowOffsetX = ERASER_SHADOW_OFFSET;
  context.shadowOffsetY = ERASER_SHADOW_OFFSET;
  context.shadowBlur = ERASER_SHADOW_BLUR;
  context.strokeStyle = ERASER_STROKE_STYLE;
}
const eraseLast = () => {
  context.save();
  setErasePathForEraser();
  drawGrid(context, GRID_LINE_COLOR, GRID_HORIZONTAL_SPACING, GRID_VERTICAL_SPACING);
  context.restore();
}
const drawEraser = loc => {
  context.save();
  setEraserAttributes();
}