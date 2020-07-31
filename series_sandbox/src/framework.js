'use strict';

var errorAlerts = true;

var canvasWidth = 10;
var canvasHeight = 10;
var delayMilliseconds = 500;

class Canvas {

  constructor() {

    // cached values

    this.grid1 = null; // ref to grid1 for pingponging rendering
    this.grid2 = null; // ref to grid2 for pingponging rendering
    this.table1 = null; // ref to <table> DOM node in grid1
    this.table2 = null; // ref to <table> DOM node in grid2
    this.rows1 = null; // ref to array of <tr> DOM nodes in grid1
    this.rows2 = null; // ref to array of <tr> DOM nodes in grid2

    // state

    this.running = false; // whether currently running animation
    this.plottingFrame1 = true; // whether plotting on frame 1
    this.startStopButton = new StartStopButton("startstop",
        this._start.bind(this), this._stop.bind(this));
  }

  clear() {
    const rows = this.plottingFrame1 ? this.rows1 : this.rows2;
    for (let r = 0; r < canvasHeight; ++r) {
      const targetCells = rows[r].children;
      for (let c = 0; c < canvasWidth; ++c) {
        targetCells[c].className = null;
      }
    }
  }
  
  plot(x, y, color) {
    x = Math.floor(x);
    y = Math.floor(y);
    this._validatePoint(x, y);
    this._validateColor(color);
    const rows = this.plottingFrame1 ? this.rows1 : this.rows2;
    rows[y].children[x].className = color;
  }
    
  swap() {
    if (this.plottingFrame1) {
      this.grid1.addClass("hide");
      this.grid2.removeClass("hide");
    } else {
      this.grid2.addClass("hide");
      this.grid1.removeClass("hide");
    }
    this.plottingFrame1 = !this.plottingFrame1;
  }

  async delay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.running) {
          console.log("STOPPED ANIMATION");
          throw Error("STOPPED ANIMATION");
        }
        resolve();
      }, delayMilliseconds);
    });
  }
  
  _init() {
    this._validateDimensions(canvasWidth, canvasHeight);
    this._validateDelay(delayMilliseconds);
    const gridHTML = this._createGridHTML();
    this.grid1 = $("#grid1");
    this.grid1.append(gridHTML);
    this.table1 = this.grid1.children().first()[0];
    this.rows1 = this.table1.children[0].children;
    this.grid2 = $("#grid2");
    this.grid2.append(gridHTML);
    this.table2 = this.grid2.children().first()[0];
    this.rows2 = this.table2.children[0].children;
    this.grid2.addClass("hide");
    this._setGridAspectRatio();
  }

  _createGridHTML() {
    let html = "<table class='canvas'>\n";
    for (let r = 0; r < canvasHeight; ++r) {
      html += "<tr>";
      for (let c = 0; c < canvasWidth; ++c) {
        html += "<td></td>";
      }
      html += "</tr>\n";
    }
    return html + "</table>\n";
  }
  
  _setGridAspectRatio() {
    const topOffset = Math.max(this.table1.getBoundingClientRect().top,
        this.table2.getBoundingClientRect().top);
    this._setAspectRatio(this.table1, topOffset, canvasWidth, canvasHeight);
    this._setAspectRatio(this.table2, topOffset, canvasWidth, canvasHeight);
  }
  
  _setAspectRatio(child, topOffset, width, height) {
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
  
  async _start() {
    this.clear();
    this.swap();
    this.clear();
    this.running = true;
    await animate();
    this.running = false;
    this.startStopButton.reset();
  }

  _stop() {
    if (!this.running) {
      _error("can't stop animation because it isn't running");
    }
    this.running = false;
  }
  
  _validateColor(color) {
    if (color != null && (typeof color != "string" || color.length == 0)) {
      _error("color must either be null or a CSS class name");
    }
  }

  _validateDelay() {
    if (isNaN(delayMilliseconds) || delayMilliseconds < 0 ||
        delayMilliseconds >= 2000) {
      _error("delayMilliseconds must be a number between 0 and 2000");
    }
  }

  _validateDimensions(width, height) {
    if (isNaN(width) || isNaN(height)) {
      _error("width and height must be numbers");
    }
    if (width < 1 || height < 1) {
      _error("width and height must be >= 1");
    }
  }

  _validatePoint(x, y) {
    if (isNaN(x) || isNaN(y)) {
      _error("x and y must be numbers");
    }
    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) {
      _error("the (x, y) coordinates are not on the grid");
    }
  }
}

var canvas;

$(document).ready(function() {

  canvas = new Canvas();
  canvas._init();

  $(window).resize(function (event) {
    canvas._setGridAspectRatio();
  })
})

class StartStopButton {

  constructor(id, startFunc, stopFunc) {
    const self = this;

    this.button = $("#" + id);
    this.ran = false;
    this.reset();
    this.button.click(async function (event) {
      if (self.running) {
        self.reset();
        stopFunc();
      } else {
        self.ran = true;
        self.button.text("Stop");
        self.running = true;
        await startFunc();
      }
    })
  }

  reset() {
    this.running = false;
    this.button.text(this.ran ? "Restart" : "Start");
  }
}

function plot(x, y, color) {
  canvas.plot(x, y, color);
}

async function delay(milliseconds) {
  await canvas.delay(milliseconds);
}

function clear() {
  canvas.clear();
}

function swap() {
  canvas.swap();
}

function _error(message) {
  if (errorAlerts) {
    alert("ERROR: " + message);
  }
  throw Error(message);
}
