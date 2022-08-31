let AXIS_MARGIN = 40,
  AXIS_ORIGIN = { x: AXIS_MARGIN, y: canvas.height - AXIS_MARGIN },
  AXIS_TOP = AXIS_MARGIN,
  AXIS_RIGHT = canvas.width - AXIS_MARGIN,

  HORIZONTAL_TICK_SPACE = 10,
  VERTICAL_TICK_SPACING = 10,

  AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x,
  AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP,

  NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING,
  NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACE,

  TICK_WIDTH = 10,
  TICKS_LINEWIDTH = 0.5,
  TICKS_COLOR = 'navy',

  AXIS_LINEWIDTH = 1.0,
  AXIS_COLOR = 'blue';

const drawHorizontalAxis = (context) => {
  context.beginPath();
  context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
  context.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y);
  context.stroke();
}

const drawVerticalAxis = (context) => {
  context.beginPath();
  context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
  context.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
  context.stroke();
}

const drawVerticalAxisTicks = (context) => {
  let deltaX;
  for (let i = 1; i < NUM_VERTICAL_TICKS; i++) {
    context.beginPath();
    deltaX = i % 5 == 0 ? TICK_WIDTH : TICK_WIDTH / 2;
    context.moveTo(AXIS_ORIGIN.x - deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);
    context.lineTo(AXIS_ORIGIN.x + deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);
    context.stroke();
  }
}

const drawHorizontalAxisTicks = (context) => {
  let deltaY;
  for (let i = 1; i < NUM_HORIZONTAL_TICKS; i++) {
    context.beginPath();
    deltaY = i % 5 == 0 ? TICK_WIDTH : TICK_WIDTH / 2;
    context.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACE, AXIS_ORIGIN.y - deltaY);
    context.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACE, AXIS_ORIGIN.y + deltaY);
    context.stroke();
  }
}

const drawAxes = (context) => {
  context.save();
  context.strokeStyle = AXIS_COLOR;
  context.lineWidth = AXIS_LINEWIDTH;

  drawHorizontalAxis(context);
  drawVerticalAxis(context);

  context.lineWidth = 0.5;
  context.lineWidth = TICKS_LINEWIDTH;
  context.strokeStyle = TICKS_COLOR;

  drawVerticalAxisTicks(context);
  drawHorizontalAxisTicks(context);

  context.restore();
}

export { drawAxes }