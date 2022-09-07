let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  image = new Image();

image.src = "../../assets/logo1.jpg";
image.onload = e => {
  context.drawImage(image, 10, 10);
}