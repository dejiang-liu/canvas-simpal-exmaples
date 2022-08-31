const roundeRect = (cornerX, cornerY, width, height, cornerRadius, context) => {
  if (width > 0) {
    context.moveTo(cornerX + cornerRadius, cornerY);
  } else {
    context.moveTo(cornerX - cornerRadius, cornerY);
  }
  context.arcTo(cornerX + width, cornerY, cornerX + width, cornerY + height, cornerRadius);
  context.arcTo(cornerX + width, cornerY + height, cornerX, cornerY + height, cornerRadius);
  context.arcTo(cornerX, cornerY + height, cornerX, cornerY, cornerRadius);
  if (width > 0) {
    context.arcTo(cornerX, cornerY, cornerX + cornerRadius, cornerY, cornerRadius)
  } else {
    context.arcTo(cornerX, cornerY, cornerX - cornerRadius, cornerY, cornerRadius)
  }
}

const drawRoundeRect = (strokeStyle, fillStyle, cornerX, cornerY, width, height, cornerRadius, context) => {
  context.beginPath();
  roundeRect(cornerX, cornerY, width, height, cornerRadius, context);
  context.strokeStyle = strokeStyle;
  context.fillStyle = fillStyle;

  context.stroke();
  // context.fill();
}

export { drawRoundeRect }