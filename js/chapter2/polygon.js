let mousedown = {
  x: 120,
  y: 200
},
  rubberbandRect = {
    width: 50
  },
  Point = function (x, y) {
    this.x = x;
    this.y = y
  }

const getPolygonPoints = (centerX, centerY, radius, sides, startAngle) => {
  let points = [], angle = startAngle || 0;
  for (let i = 0; i < sides; i++) {
    points.push(new Point(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle)));
    angle += 2 * Math.PI / sides;
  }
  return points;
}

const createPolygonPath = (context, centerX, centerY, radius, sides, startAngle) => {
  let points = getPolygonPoints(centerX, centerY, radius, sides, startAngle);
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < sides; ++i) {
    context.lineTo(points[i].x, points[i].y)
  }
  context.closePath();
}

const drawRubberbandShape = (context) => {
  createPolygonPath(context, mousedown.x, mousedown.y, rubberbandRect.width, parseInt(5), (Math.PI / 180) * parseInt(0));
  context.strokeStyle = 'blue';
  context.stroke();
  // context.fill();
}

export { drawRubberbandShape }