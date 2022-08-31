import { drawGrid } from "./drawGrid.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  eraseAllButton = document.getElementById('eraseAllButton'),
  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
  guidewireCheckbox = document.getElementById('guidewireCheckbox'),
  instructions = document.getElementById('instructions'),
  instructionsOkayButton = document.getElementById('instructionsOkayButton'),
  instructionsNoMoreButton = document.getElementById('instructionsNoMoreButton'),

  showInstructions = true,

  AXIS_MARGIN = 40,
  HORIZONTAL_TICK_SPACE = 10,
  VERTICAL_TICK_SPACING = 10,
  TICK_SIZE = 10,

  AXIS_ORIGIN = { x: AXIS_MARGIN, y: canvas.height - AXIS_MARGIN },
  AXIS_TOP = AXIS_MARGIN,

  AXIS_RIGHT = canvas.width - AXIS_MARGIN,
  AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x,
  AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP,

  NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING,
  NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACE,

  GRID_STROKE_STYLE = 'lightblue',
  GRID_SPACING = 10,

  CONTROL_POINT_RADIUS = 5,
  CONTROL_POINT_STROKE_STYLE = 'blue',
  CONTROL_POINT_FILL_STYLE = 'rgba(255, 255, 0, 0.5)',

  END_POINT_STROKE_STYLE = 'navy',
  END_POINT_FILL_STYLE = 'rgba(0, 255, 0, 0.5)',

  GUIDEWIRE_STROKE_STYLE = 'rgba(0, 0, 230, 0.4)',

  drawingSurfaceImageData,

  mousedown = {},
  rubberbandRect = {},

  dragging = false,
  draggingPoint = false,

  endPoints = [{}, {}],
  controlPoints = [{}, {}],
  editing = false,

  guidewires = $('#guidewireCheckbox')[0].checked;

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
const updateRubberbandRectangle = (loc) => {
  rubberbandRect.width = Math.abs(loc.x - mousedown.x);
  rubberbandRect.height = Math.abs(loc.y - mousedown.y);
  rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
  rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}
const drawBezierCurve = () => {
  context.beginPath();
  context.moveTo(endPoints[0].x, endPoints[0].y);
  context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoints[1].x, endPoints[1].y);
  context.stroke();
}

const updateEndAndControlPoints = () => {
  endPoints[0].x = rubberbandRect.left;
  endPoints[0].y = rubberbandRect.top;
  endPoints[1].x = rubberbandRect.left + rubberbandRect.width;
  endPoints[1].y = rubberbandRect.top + rubberbandRect.height;

  controlPoints[0].x = rubberbandRect.left;
  controlPoints[0].y = rubberbandRect.top + rubberbandRect.height;
  controlPoints[1].x = rubberbandRect.left + rubberbandRect.width;
  controlPoints[1].y = rubberbandRect.top;
}

const drawRubberbandShape = loc => {
  updateEndAndControlPoints();
  drawBezierCurve();
}

const updateRubberband = (loc) => {
  updateRubberbandRectangle(loc);
  drawRubberbandShape(loc);
}
// Guidewires .... 
const drawHorizontalGuidewire = (y) => {
  context.beginPath();
  context.moveTo(0, y + 0.5);
  context.lineTo(context.canvas.width, y + 0.5);
  context.stroke();
}
const drawVerticalGuidewire = (x) => {
  context.beginPath();
  context.moveTo(x + 0.5, 0);
  context.lineTo(x + 0.5, context.canvas.height);
  context.stroke();
}
const drawGuidewires = (x, y) => {
  context.save();
  context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
  context.lineWidth = 0.5;
  drawVerticalGuidewire(x);
  drawHorizontalGuidewire(y);
  context.restore();
}
// Endpoints and controls points
const drawControlPoint = (index) => {
  context.beginPath();
  context.arc(controlPoints[index].x, controlPoints[index].y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);
  context.stroke();
  context.fill();
}
const drawControlPoints = () => {
  context.save();
  context.strokeStyle = CONTROL_POINT_STROKE_STYLE;
  context.fillStyle = CONTROL_POINT_FILL_STYLE;
  drawControlPoint(0);
  drawControlPoint(1);
  context.stroke();
  context.fill();
  context.restore();
}
const drawEndPoint = (index) => {
  context.beginPath();
  context.arc(endPoints[index].x, endPoints[index].y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);
  context.stroke();
  context.fill();
}
const drawEndPoints = () => {
  context.save();
  context.strokeStyle = END_POINT_STROKE_STYLE;
  context.fillStyle = END_POINT_FILL_STYLE;
  drawEndPoint(0);
  drawEndPoint(1);
  context.stroke();
  context.fill();
  context.restore();
}
const drawControlAndEndPoints = () => {
  drawControlPoints();
  drawEndPoints();
}
const cursorInEndPoint = (loc) => {
  let pt;
  endPoints.forEach(point => {
    context.beginPath();
    context.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);
    if (context.isPointInPath(loc.x, loc.y)) {
      pt = point;
    }
  });
  return pt;
}
const cursorInControlPoint = (loc) => {
  let pt;
  controlPoints.forEach(point => {
    context.beginPath();
    context.arc(point.x, point.y, CONTROL_POINT_RADIUS, 0, Math.PI * 2, false);
    if (context.isPointInPath(loc.x, loc.y)) {
      pt = point;
    }
  });
  return pt;
}
const updateDraggingPoint = (loc) => {
  draggingPoint.x = loc.x;
  draggingPoint.y = loc.y;
}
// canvas event handlers ...
canvas.onmousedown = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  e.preventDefault();
  if (!editing) {
    saveDrawingSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    updateRubberbandRectangle(loc);
    dragging = true;
  } else {
    draggingPoint = cursorInControlPoint(loc);
    if (!draggingPoint) {
      draggingPoint = cursorInEndPoint(loc);
    }
  }
}
canvas.onmousemove = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  if (dragging || draggingPoint) {
    e.preventDefault();
    restoreDrawingSurface();
    if (guidewires) {
      drawGuidewires(loc.x, loc.y);
    }
  }
  if (dragging) {
    updateRubberband(loc);
    drawControlAndEndPoints();
  } else if (draggingPoint) {
    updateDraggingPoint(loc);
    drawControlAndEndPoints();
    drawBezierCurve();
  }
}

canvas.onmouseup = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  restoreDrawingSurface();
  if (!editing) {
    updateRubberband(loc);
    drawControlAndEndPoints();
    dragging = false;
    editing = true;
    if (showInstructions) {
      instructions.style.display = 'inline';
    }
  } else {
    if (draggingPoint) {
      drawControlAndEndPoints();
    } else {
      editing = false;
    }
    drawBezierCurve();
    draggingPoint = undefined;
  }
}

eraseAllButton.onclick = (e) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(context, GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING);
  saveDrawingSurface();
  editing = false;
  dragging = false;
  draggingPoint = undefined;
}
strokeStyleSelect.onchange = e => {
  context.strokeStyle = strokeStyleSelect.value;
}
guidewireCheckbox.onchange = e => {
  guidewires = guidewireCheckbox.checked;
}
instructionsOkayButton.onclick = e => {
  instructions.style.display = 'none';
}
instructionsNoMoreButton.onclick = e => {
  instructions.style.display = 'none';
  showInstructions = false;
}
drawGrid(context, GRID_STROKE_STYLE, GRID_SPACING, GRID_SPACING)

context.strokeStyle = strokeStyleSelect.value;
