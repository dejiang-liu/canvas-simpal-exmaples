let endPoints = [
  { x: 130, y: 70 }, { x: 430, y: 270 },
];
let controlPoints = [
  { x: 130, y: 250 }, { x: 450, y: 70 }
];

const drawBezierCurve = (context) => {
  context.strokeStyle = 'blue';
  context.beginPath();
  context.moveTo(endPoints[0].x, endPoints[0].y);
  context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoints[1].x, endPoints[1].y);
  context.stroke();
}

const drawEndPoints = (context) => {
  context.strokeStyle = 'red';
  context.fillStyle = 'red';
  endPoints.forEach(point => {
    context.beginPath();
    context.arc(point.x, point.y, 5, 0, Math.PI * 2, false);
    context.stroke();
    context.fill();
  })
}

const drawControlPoints = (context) => {
  context.strokeStyle = 'yellow';
  context.fillStyle = 'green';
  controlPoints.forEach(point => {
    context.beginPath();
    context.arc(point.x, point.y, 5, 0, Math.PI * 2, false);
    context.stroke();
    context.fill();
  })
}

export { drawControlPoints, drawEndPoints, drawBezierCurve }