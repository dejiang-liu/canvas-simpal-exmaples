import { drawGrid } from "./chapter2/drawGrid.js";
import { drawAxes } from './chapter2/axis.js';
import { drawRoundeRect } from './chapter2/arcto.js';
import { readyDraw, drawDial } from './chapter2/drawDial.js'
import { drawArrow, drawBezierPoints } from './chapter2/bezierCurve.js'
import { drawControlPoints, drawEndPoints, drawBezierCurve } from './chapter2/bezierCurve3th.js'
import { drawRubberbandShape } from './chapter2/polygon.js'

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d");
// drawGrid(context, 'lightgray', 10, 10); // 绘制网格
// drawAxes(context); // 绘制坐标轴

// drawRoundeRect('blue', 'yellow', 10, 10, 100, 100, 10, context);
// drawRoundeRect('black', 'skyblue', 525, 140, -100, -100, 40, context)

// 静态表盘
// readyDraw(context);
drawGrid(context, 'lightgray', 10, 10);
// drawDial(context);

// 二次贝塞尔曲线 三角
// context.clearRect(0, 0, canvas.clientWidth, canvas.height);
// drawArrow(context);
// drawBezierPoints(context);

// 三次贝塞尔曲线
// drawControlPoints(context);
// drawEndPoints(context);
// drawBezierCurve(context);

// 多边形
drawRubberbandShape(context)