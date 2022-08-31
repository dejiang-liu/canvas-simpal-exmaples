import { drawGrid } from "./drawGrid.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d");
let drawingSurfaceImageData,
  mousedown = {},
  rubberbandRect = {},
  dragging = false,
  guidewires = $('#guidewireCheckbox')[0].checked;

const windowToCanvas = (x, y) => {
  let bbox = canvas.getBoundingClientRect();
  return {
    x: x - bbox.left * (canvas.width / bbox.width),
    y: y - bbox.top * (canvas.height / bbox.height)
  }
}

const saveDrawingSurface = () => {
  drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height); // 返回一个ImageData对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示
}

const restoreDrawingSurface = () => {
  context.putImageData(drawingSurfaceImageData, 0, 0);  // 将数据从已有的 ImageData 对象绘制到位图的方法。
}

const updateRubberBandRectangle = (loc) => {
  rubberbandRect.width = Math.abs(loc.x - mousedown.x);
  rubberbandRect.height = Math.abs(loc.y - mousedown.y);

  rubberbandRect.left = loc.x > mousedown.x ? mousedown.x : loc.x;
  rubberbandRect.top = loc.y > mousedown.y ? mousedown.y : loc.y;
}
// 画图
const drawRubberbandShape = (loc) => {
  //* 画直线
  // context.beginPath();
  // context.moveTo(mousedown.x, mousedown.y);
  // context.lineTo(loc.x, loc.y);
  // context.stroke();
  //* 画圆
  drawCircleShape(loc)
}
const drawCircleShape = (loc) => {
  let angle, radius;
  if (mousedown.y === loc.y) {
    radius = Math.abs(loc.x - mousedown.x);
  } else {
    angle = Math.atan(rubberbandRect.height / rubberbandRect.width);
    radius = rubberbandRect.height / Math.sin(angle);
  }
  context.beginPath();
  context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, false);
  context.stroke();
  if (guidewires) {
    context.fillStyle = $('#strokestyleSelect')[0].value;
    context.fill();
  }
}

const updateRubberband = (loc) => {
  updateRubberBandRectangle(loc);
  drawRubberbandShape(loc);
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

canvas.onmousedown = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  e.preventDefault();
  saveDrawingSurface();
  mousedown.x = loc.x;
  mousedown.y = loc.y;
  dragging = true;
}

canvas.onmousemove = (e) => {
  let loc;
  if (dragging) {
    e.preventDefault();
    loc = windowToCanvas(e.clientX, e.clientY);
    restoreDrawingSurface();
    updateRubberband(loc);
    if (guidewires) {
      drawGuidewires(loc.x, loc.y);
    }
  }
}

canvas.onmouseup = (e) => {
  let loc = windowToCanvas(e.clientX, e.clientY);
  restoreDrawingSurface();
  updateRubberband(loc);
  dragging = false;
}

$('#eraseAllButton').click(() => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(context, 'lightgray', 10, 10);
  saveDrawingSurface();
  context.strokeStyle = $('#strokestyleSelect')[0].value;
})

$('#strokestyleSelect').change((e) => {
  context.strokeStyle = e.target.value;
})

$("#guidewireCheckbox").change((e) => {
  guidewires = e.target.checked;
})
drawGrid(context, 'lightgray', 10, 10);

context.strokeStyle = $('#strokestyleSelect')[0].value;
// console.log($('#strokestyleSelect')[0].value)
