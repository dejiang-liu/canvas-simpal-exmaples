import { drawGrid } from "./drawGrid.js";
import Polygon from './polygonObj.js';

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  eraseAllButton = document.getElementById('eraseAllButton'),
  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
  fillStyleSelect = document.getElementById('fillStyleSelect'),
  fillCheckbox = document.getElementById('fillCheckbox'),
  editCheckbox = document.getElementById('editCheckbox'),
  sidesSelect = document.getElementById('sidesSelect'),
  startAngleSelect = document.getElementById('startAngleSelect'),
  guidewireCheckbox = document.getElementById('guidewireCheckbox'),

  drawingSurfaceImageData,

  mousedown = {},
  rubberbandRect = {},

  dragging = false,
  draggingOffsetX,
  draggingOffsetY,

  sides = 8,
  startAngle = 0,

  guidewires = true,
  editing = false,
  polygons = [];

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
// Draw a polgon
const drawPolygon = (polygon) => {
  context.beginPath();
  polygon.createPath(context);
  polygon.stroke(context);

  if (polygon.filled) {
    polygon.fill(context)
  }
}
// Rubber bands
const updateRubberBandRectangle = (loc) => {
  rubberbandRect.width = Math.abs(loc.x - mousedown.x);
  rubberbandRect.height = Math.abs(loc.y - mousedown.y);
  rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
  rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}
const drawRubberbandShape = (loc) => {
  let polygon = new Polygon(loc.x, loc.y, rubberbandRect.width,
    parseInt(sidesSelect.value), (Math.PI / 180) * parseInt(startAngleSelect.value),
    context.strokeStyle, context.fillStyle, fillCheckbox.checked);
  drawPolygon(polygon);
  if (!dragging) {
    polygons.push(polygon)
  }
}

// GuidWires .............
const drawHorizontalLine = (y) => {
  context.beginPath();
  context.moveTo(0, y + 0.5);
  context.lineTo(context.canvas.width, y + 0.5);
  context.stroke();
}

const drawVerticalLine = (x) => {
  context.beginPath();
  context.moveTo(x + 0.5, 0);
  context.lineTo(x + 0.5, context.canvas.height);
  context.stroke();
}

const drawGuidewires = (x, y) => {
  context.save();
  // context.setLineDash([5, 5])
  context.strokeStyle = 'rgba(0, 0, 230, 0.4';
  context.lineWidth = 0.5;
  drawVerticalLine(x);
  drawHorizontalLine(y);
  context.restore();
}

const drawPolygons = () => {
  // drawGrid(context, 'lightgray', 10, 10);
  polygons.forEach(polygon => {
    drawPolygon(polygon)
  })
}
// dragging ...
const startDragging = (loc) => {
  saveDrawingSurface();
  console.log('start dragging')
  mousedown.x = loc.x;
  mousedown.y = loc.y;
}
const startEditing = () => {
  canvas.style.cursor = 'pointer';
  editing = true;
}
const stopEditing = () => {
  canvas.style.cursor = 'crosshair';
  editing = false;
}
const updateRubberband = (loc) => {
  updateRubberBandRectangle(loc);
  drawRubberbandShape(loc);
}
// event handlers ...
canvas.onmousedown = function (e) {
  let loc = windowToCanvas(e.clientX, e.clientY);
  e.preventDefault();
  if (editing) {
    polygons.forEach(polygon => {
      polygon.createPath(context);
      if (context.isPointInPath(loc.x, loc.y)) {
        startDragging(loc);
        dragging = polygon;
        draggingOffsetX = loc.x - polygon.x;
        draggingOffsetY = loc.y - polygon.y;
        return;
      }
    });
  } else {
    startDragging(loc);
    dragging = true;
  }
}
canvas.onmousemove = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  e.preventDefault();
  if (editing && dragging) {
    dragging.x = loc.x - draggingOffsetX;
    dragging.y = loc.y - draggingOffsetY;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPolygons();
  } else {
    if (dragging) {
      restoreDrawingSurface();
      updateRubberband(loc);
      if (guidewireCheckbox.checked) {
        drawGuidewires(loc.x, loc.y)
      }
    }
  }
}
canvas.onmouseup = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  dragging = false;
  if (!editing) {
    restoreDrawingSurface();
    updateRubberBandRectangle(loc);
    drawRubberbandShape(loc);
  }
}


eraseAllButton.onclick = (e) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(context, 'lightgray', 10, 10);
  saveDrawingSurface();
  console.log('erase all button');
  polygons = [];
}
strokeStyleSelect.onchange = (e) => {
  context.strokeStyle = strokeStyleSelect.value;
}
fillStyleSelect.onchange = (e) => {
  context.fillStyle = fillStyleSelect.value;
}
editCheckbox.onchange = (e) => {
  if (editCheckbox.checked) {
    startEditing();
  } else {
    stopEditing();
  }
}
context.strokeStyle = strokeStyleSelect.value;
context.fillStyle = fillStyleSelect.value;
context.shadowColor = 'rgba(0, 0, 0, 0.4)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;
drawGrid(context, 'lightgray', 10, 10);