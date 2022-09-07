let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  image = new Image(),

  scaleOutput = document.getElementById('scaleOutput'),
  scaleSlider = document.getElementById('scaleSlider'),
  scale = 1.0,

  MINIMUM_SCALE = 1.0,
  MAXIMUM_SCALE = 3.0;

const drawScaled = () => {
  let w = canvas.width,
    h = canvas.height,
    sw = w * scale,
    sh = h * scale;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawWatermark();
  context.drawImage(canvas, 0, 0, canvas.width, canvas.height, -sw / 2 + w / 2, -sh / 2 + h / 2, sw, sh);
}

const drawScaleText = value => {
  let text = parseFloat(value).toFixed(2);
  let percent = parseFloat(value - MINIMUM_SCALE) / parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);
  scaleOutput.innerText = text;
  percent = percent < 0.35 ? 0.35 : percent;
  scaleOutput.style.fontSize = percent * MAXIMUM_SCALE / 1.5 + 'em';
}

const drawWatermark = () => {
  let lineOne = 'Copyright',
    lineTwo = 'Acme Inc.',
    textMetrics,
    FONT_HEIGHT = 128;
  context.save();
  context.font = FONT_HEIGHT + 'px Arial';
  textMetrics = context.measureText(lineOne);
  context.globalAlpha = 0.6;
  context.translate(canvas.width / 2, canvas.height / 2 - FONT_HEIGHT / 2);
  context.fillText(lineOne, -textMetrics.width / 2, 0);
  context.strokeText(lineOne, -textMetrics.width / 2, 0);
  textMetrics = context.measureText(lineTwo);
  context.fillText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT);
  context.strokeText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT);
  context.restore();
}
scaleSlider.onchange = e => {
  scale = e.target.value;
  if (scale < MINIMUM_SCALE) {
    scale = MINIMUM_SCALE;
  } else if (scale > MAXIMUM_SCALE) {
    scale = MAXIMUM_SCALE;
  }
  drawScaled();
  drawScaleText(scale);
}
context.fillStyle = 'skyblue';
context.strokeStyle = 'yellow';
context.shadowColor = 'rgba(50, 50, 50)';
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 10;
let glassSize = 150;
image.src = '../../assets/logo1.jpg';
image.onload = e => {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawWatermark();
  drawScaleText(scaleSlider.value);
}