'use strict';

var errorAlerts = true;

var canvasWidth = 10;
var canvasHeight = 10;
var enforceBoundaries = true;

var _canvas = {
  table: null,
  rows: null,
  plots: []
};

class Plot {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

function plot(x, y, color) {
  x = Math.floor(x);
  y = Math.floor(y);
  _validateColor(color);
  if (_validatePoint(x, y)) {
    _canvas.plots.push(new Plot(x, y, color));
  }
}
  
function _initialize() {
  _validateDimensions(canvasWidth, canvasHeight);
  canvasWidth = canvasWidth;
  canvasHeight = canvasHeight;
  let grid = $("#grid");
  grid.append(_createGridHTML());
  _canvas.table = grid.children().first()[0];
  _canvas.rows = _canvas.table.children[0].children;
  _setGridAspectRatio();
}

function _createGridHTML() {
  let html = "<table id='canvas'>\n";
  for (let r = 0; r < canvasHeight; ++r) {
    html += "<tr>";
    for (let c = 0; c < canvasWidth; ++c) {
      html += "<td></td>";
    }
    html += "</tr>\n";
  }
  return html + "</table>\n";
}

function _drawCanvas() {
  for (let i = 0; i < _canvas.plots.length; ++i) {
    const plot = _canvas.plots[i];
    _canvas.rows[plot.y].children[plot.x].className = plot.color;
  }
}

function _setGridAspectRatio() {
  const topOffset = _canvas.table.getBoundingClientRect().top;
  _setAspectRatio(_canvas.table, topOffset, canvasWidth, canvasHeight);
}
  
function _setAspectRatio(child, topOffset, width, height) {
  // CSS solutions were too hard to make behave as expected
  const aspectRatio = width / height;
  let adjustedWidth = window.innerWidth;
  let adjustedHeight = adjustedWidth / aspectRatio;
  if (adjustedHeight + topOffset > window.innerHeight) {
    adjustedHeight = window.innerHeight - topOffset;
    adjustedWidth = adjustedHeight * aspectRatio;
  }
  child.style.width = adjustedWidth + "px";
  child.style.height = adjustedHeight + "px";
}

function _validateDimensions(width, height) {
  if (isNaN(width) || isNaN(height)) {
    _error("canvasWidth and canvasHeight must be numbers");
  }
  if (width < 1 || height < 1) {
    _error("canvasWidth and canvasHeight must be >= 1");
  }
}

function _validatePoint(x, y) {
  if (isNaN(x) || isNaN(y)) {
    _error("x and y must be numbers");
  }
  if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) {
    if (enforceBoundaries)
      _error("the (x, y) coordinates are not on the grid");
    else
      return false;
  }
  return true;
}

function _validateColor(color) {
  if (color != null && (typeof color != "string" || color.length == 0)) {
    _error("color must either be null or a CSS class name");
  }
}

$(document).ready(function() {

  _initialize();

  $(window).resize(function (event) {
    _setGridAspectRatio();
  })

  _drawCanvas();
})

function _error(message) {
  if (errorAlerts) {
    alert("ERROR: " + message);
  }
  throw Error(message);
}
