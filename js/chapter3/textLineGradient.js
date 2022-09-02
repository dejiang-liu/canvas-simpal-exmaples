let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  image = new Image(),
  gradient = context.createLinearGradient(0, 0, canvas.clientWidth, canvas.height),
  text = 'CANVAS',
  pattern;

const drawGradientText = () => {
  context.fillStyle = gradient;
  context.fillText(text, 65, 200);
  context.strokeText(text, 65, 200);
}

const drawPatternText = () => {
  context.fillStyle = pattern;
  context.fillText(text, 65, 200);
  context.strokeText(text, 65, 200);
}

image.onload = e => {
  pattern = context.createPattern(image, 'repeat');
  drawPatternText();
}

const drawGradientTextReadyPre = () => {
  image.src = '../../img.jpg';

  context.font = '156px Palatino';
  context.strokeStyle = 'cornflowerblue';
  context.shadowColor = 'rgba(100, 100, 150, 0.8)';
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;
  context.shadowBlur = 10;

  gradient.addColorStop(0, 'blue');
  gradient.addColorStop(0.25, 'green');
  gradient.addColorStop(0.5, 'white');
  gradient.addColorStop(0.75, 'red');
  gradient.addColorStop(1.0, 'yellow');
  
  drawGradientText();
}
export { drawGradientTextReadyPre }



