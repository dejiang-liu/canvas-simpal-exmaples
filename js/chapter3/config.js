class TextCursor {
  constructor(fillStyle, width) {
    this.fillStyle = fillStyle || 'rgba(0, 0, 0, 0.5)';
    this.width = width || 2;
    this.left = 0;
    this.right = 0;
    this.top = 0;
  }
  getHeight(context) {
    let h = context.measureText('W').width;
    return h + h / 6;
  }
  createPath(context) {
    context.beginPath();
    context.rect(this.left, this.top, this.width, this.getHeight(context));
  }
  draw(context, left, bottom) {
    context.save();
    this.left = left;
    this.top = bottom - this.getHeight(context);
    this.createPath(context);
    context.fillStyle = this.fillStyle;
    context.fill();
    context.restore();
  }
  erase(context, imageData) {
    // context.putImageData(imageData, 0, 0, this.left, this.top, this.width, this.getHeight(context));
    context.putImageData(imageData, 0, 0, this.left, this.top, 1.2 * this.width, 1.2 * this.getHeight(context));
  }
}

class TextLine {
  constructor(x, y) {
    this.text = '';
    this.left = x;
    this.bottom = y;
    this.caret = 0;
  }
  insert(text) {
    this.text = this.text.substring(0, this.caret) + text + this.text.substring(this.caret);
    this.caret += text.length;
  }
  removeCharacterBeforeCaret() {
    if (this.caret === 0) {
      return;
    }
    this.text = this.text.substring(0, this.caret - 1) + this.text.substring(this.caret);
    this.caret--;
  }
  getWidth(context) {
    return context.measureText(this.text).width;
  }
  getHeight(context) {
    let h = context.measureText('W').width;
    return h + h / 6;
  }
  draw(context) {
    context.save();
    context.textAlign = 'start';
    context.textBaseline = 'bottom';
    context.strokeText(this.text, this.left, this.bottom);
    context.fillText(this.text, this.left, this.bottom);
    context.restore();
  }
  erase(context, imageData) {
    context.putImageData(imageData, 0, 0)
  }
}

export { TextCursor, TextLine }