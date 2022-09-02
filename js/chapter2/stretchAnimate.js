let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d");

const drawText = () => {
  context.save();
  context.shadowColor = 'rgba(100, 100, 150, 0.8)';
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;
  context.shadowBlur = 10;

  context.fillStyle = 'cornflowerblue';
  context.fillText('CANVAS', 20, 250);
  context.strokeStyle = 'yellow';
  context.strokeText('CANVAS', 20, 250);
  context.restore();
}
const setClippingRegion = (radius) => {
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2, false);
  context.clip();
}
const fillCanvas = color => {
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
}
const endAnimation = loop => {
  clearInterval(loop);
  setTimeout(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawText();
  }, 1000);
}
const drawAnimationFrame = radius => {
  setClippingRegion(radius);
  fillCanvas('lightgray');
  drawText();
}
const animate = () => {
  let radius = canvas.width / 2, loop;
  loop = window.setInterval(() => {
    radius -= canvas.width / 100;
    fillCanvas('green');
    // debugger;
    if (radius > 0) {
      context.save();
      drawAnimationFrame(radius);
      context.restore();
    } else {
      endAnimation(loop);
    }
  }, 16)
}
canvas.onmousedown = e => {
  animate();
}
context.lineWidth = 0.5;
context.font = '128pt Comic-sans';
drawText();