let CENTROID_RADIUS = 10,
  CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
  CENTROID_FILL_STYLE = 'rgba(80, 190, 240, 0.6)',

  RING_INNER_RADIUS = 35,
  RING_OUTER_RADIUS = 55,

  ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
  ANNOTATIONS_TEXT_SIZE = 12,

  TICK_WIDTH = 10,
  TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
  TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)',

  TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)',

  GUIDEWIRE_STROKE_STYLE = 'goldenrod',
  GUIDEWIRE_FILL_STYLE = 'rgba(250, 250, 0, 0.6)',

  circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 150
  };

const drawDial = (context) => {
  let loc = {
    x: circle.x,
    y: circle.y
  };
  drawCentroid(context);
  drawCentroidGuidewire(context, loc);
  drawRing(context);
  drawTickInnerCircle(context);
  drawTicks(context);
  drawAnnotations(context);
}
const drawCentroid = (context) => {
  context.beginPath();
  context.save();
  context.strokeStyle = CENTROID_STROKE_STYLE;
  context.fillStyle = CENTROID_FILL_STYLE;
  context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI*2, false);
  context.stroke();
  context.fill();
  context.restore();
}

const drawCentroidGuidewire = (context, loc) => {
  let angle = -Math.PI / 4,
    radius, endpt;
  radius = circle.radius + RING_OUTER_RADIUS;
  if (loc.x >= circle.x) {
    endpt = {
      x: circle.x + radius * Math.cos(angle),
      y: circle.y + radius * Math.sin(angle)
    }
  } else {
    endpt = {
      x: circle.x - radius * Math.cos(angle),
      y: circle.y - radius * Math.sin(angle)
    }
  }
  context.save();
  context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
  context.fillStyle = GUIDEWIRE_FILL_STYLE;
  context.beginPath();
  context.moveTo(circle.x, circle.y);
  context.lineTo(endpt.x, endpt.y);
  context.stroke();
  context.beginPath();
  context.strokeStyle = TICK_LONG_STROKE_STYLE;
  context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.restore();
}

const drawRing = (context) => {
  drawRingOuterCircle(context);
  context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS, 0, Math.PI * 2, false);
  context.fillStyle = 'rgba(100, 140, 230, 0.1)';
  context.fill();
  context.stroke();
}
const drawRingOuterCircle = (context) => {
  context.shadowColor = 'rgba(0, 0, 0, 0.7)';
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 3;
  context.shadowBlur = 6;
  context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius + RING_OUTER_RADIUS, 0, Math.PI * 2, true);
  context.stroke();
}

const drawTickInnerCircle = (context) => {
  context.save();
  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS - TICK_WIDTH, 0, Math.PI * 2, false);
  context.stroke();
  context.restore();
}

const drawTick = (context, angle, radius, cnt) => {
  let tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
  context.beginPath();
  context.moveTo(circle.x + Math.cos(angle) * (radius - tickWidth),
    circle.y + Math.sin(angle) * (radius - tickWidth));
  context.lineTo(circle.x + Math.cos(angle) * radius, circle.y + Math.sin(angle) * radius);
  context.strokeStyle = TICK_SHORT_STROKE_STYLE;
  context.stroke();
}
const drawTicks = (context) => {
  let radius = circle.radius + RING_INNER_RADIUS,
    ANGLE_MAX = 2 * Math.PI,
    ANGLE_DELTA = Math.PI / 64,
    tickwidth;
  context.save();
  for (let angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
    drawTick(context, angle, radius, cnt++);
  }
  context.restore();
}

const drawAnnotations = (context) => {
  let radius = circle.radius + RING_INNER_RADIUS;
  context.save();
  context.fillStyle = ANNOTATIONS_FILL_STYLE;
  context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetical';
  for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
    context.beginPath();
    context.fillText((angle * 180 / Math.PI).toFixed(0), circle.x + Math.cos(angle) * (radius - TICK_WIDTH * 2),
      circle.y - Math.sin(angle) * (radius - TICK_WIDTH * 2));
  }
  context.restore();
}

const readyDraw = (context) => {
  context.shadowColor = 'rgba(0, 0, 0, 0.4)';
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  context.shadowBlur = 4;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
}

export { readyDraw, drawDial }
