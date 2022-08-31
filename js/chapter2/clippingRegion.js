import { drawGrid } from "./drawGrid.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
  fillStyleSelect = document.getElementById('fillStyleSelect'),
  drawRadio = document.getElementById('drawRadio'),
  eraserRadio = document.getElementById('eraserRadio'),
  eraserShapeSelect = document.getElementById('eraserShapeSelect'),
  eraserWidthSelect = document.getElementById('eraserWidthSelect'),

  guidewireCheckbox = document.getElementById('guidewireCheckbox'),
  instructions = document.getElementById('instructions'),
  instructionsOkayButton = document.getElementById('instructionsOkayButton'),
  instructionsNoMoreButton = document.getElementById('instructionsNoMoreButton');
