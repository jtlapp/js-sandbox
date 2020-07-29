'use strict';

var errorAlerts = true;

class PixelArtCanvas {

  constructor() {

    // configuration

    this.gridWidth = 10; // width of the grid in cells
    this.gridHeight = 10; // height of the grid in cells
    this.delayMillis = 500; // delay between frames in milliseconds

    // cached values

    this.grid1 = null; // ref to grid1 for pingponging rendering
    this.grid2 = null; // ref to grid2 for pingponging rendering
    this.table1 = null; // ref to <table> DOM node in grid1
    this.table2 = null; // ref to <table> DOM node in grid2
    this.rows1 = null; // ref to array of <tr> DOM nodes in grid1
    this.rows2 = null; // ref to array of <tr> DOM nodes in grid2

    // state

    this.timerID = null; // timer delaying between frames
    this.frameNumber = 0; // number of frame most recently rendered
    this.startStopButton = new StartStopButton("startstop",
        this._start.bind(this), this.end.bind(this));
  }

  createFrame(width, height, initialValue=null) {
    if (width === undefined) {
      width = this.gridWidth;
      height = this.gridHeight;
    }
    this._validateDimensions(width, height);
    if (initialValue != null && typeof initialValue != "string") {
      _error("initialValue must either be null or a CSS class string");
    }
 
    const matrix = [];
    for (var r = 0; r < height; ++r) {
      const columns = [];
      for (var c = 0; c < width; ++c) {
        columns.push(initialValue);
      }
      matrix.push(columns);
    }
    return matrix;
  }
  
  setDimensions(width, height) {
    this._validateDimensions(width, height);
    this.gridWidth = width;
    this.gridHeight = height;
  }
  
  setDelay(delayMilliseconds) {
    if (isNaN(delayMilliseconds) || delayMilliseconds < 0) {
      _error("delayMilliseconds must be a number >= 0");
    }
    this.delayMillis = delayMilliseconds;
  }
  
  end() {
    if (this.timerID == null) {
      _error("can't stop animation because it isn't running");
    }
    clearTimeout(this.timerID);
    this.timerID = null;
  }

  reset() {
    const running = (this.timerID != null);
    if (running) {
      this.end();
    }
    initialize();
    this.frameNumber = 0;
    if (running) {
      this._start();
    } else {
      this.startStopButton.reset();
      this._renderFrame(this.createFrame());
    }
  }

  _init() {
    initialize();
    const gridHTML = this._createGridHTML();
    this.grid1 = $("#grid1");
    this.grid1.addClass("hide");
    this.grid1.append(gridHTML);
    this.table1 = this.grid1.children().first()[0];
    this.rows1 = this.table1.children[0].children;
    this.grid2 = $("#grid2");
    this.grid2.append(gridHTML);
    this.table2 = this.grid2.children().first()[0];
    this.rows2 = this.table2.children[0].children;
    this._setGridAspectRatio();
  }

  _createGridHTML() {
    let html = "<table id='canvas'>\n";
    for (let r = 0; r < this.gridWidth; ++r) {
      html += "<tr>";
      for (let c = 0; c < this.gridHeight; ++c) {
        html += "<td></td>";
      }
      html += "</tr>\n";
    }
    return html + "</table>\n";
  }
  
  _renderFrame(frame) {
    const oddFrame = (this.frameNumber % 2) == 1;
    const rows = oddFrame ? this.rows1 : this.rows2;
    for (let r = 0; r < this.gridHeight; ++r) {
      const sourceCells = frame[r];
      const targetCells = rows[r].children;
      for (let c = 0; c < this.gridWidth; ++c) {
        targetCells[c].className = sourceCells[c];
      }
    }
    if (oddFrame) {
      this.grid2.addClass("hide");
      this.grid1.removeClass("hide");
    } else {
      this.grid1.addClass("hide");
      this.grid2.removeClass("hide");
    }
    $("#frame_number span").text(this.frameNumber);
  }
  
  _renderNextFrame() {
    const frame = makeNextFrame(this.frameNumber++);
    if (!Array.isArray(frame)) {
      _error(`provided matrix is not an array`);
    }
    if (frame.length != this.gridHeight) {
      _error(`matrix height is ${frame.length} but grid height is ${this.gridHeight}`);
    }
    const firstRow = frame[0];
    if (!Array.isArray(firstRow)) {
      _error(`matrix rows are not arrays`);
    }
    if (firstRow.length != this.gridWidth) {
      _error(`matrix width is ${firstRow.length} but grid width is ${this.gridWidth}`);
    }
  
    this._renderFrame(frame);
    if (this.delayMillis > 0) {
      this.timerID = setTimeout(this._renderNextFrame.bind(this), this.delayMillis);
    }
  }
  
  _setGridAspectRatio() {
    const topOffset = Math.max(this.table1.getBoundingClientRect().top,
        this.table2.getBoundingClientRect().top);
    this._setAspectRatio(this.table1, topOffset, this.gridWidth, this.gridHeight);
    this._setAspectRatio(this.table2, topOffset, this.gridWidth, this.gridHeight);
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
  
  _start() {
    this._renderNextFrame();
  }

  _validateDimensions(width, height) {
    if (isNaN(width) || isNaN(height)) {
      _error("width and height must be numbers");
    }
    if (width < 1 || height < 1) {
      _error("width and height must be >= 1");
    }
  }
}

var canvas;

$(document).ready(function() {

  canvas = new PixelArtCanvas();
  canvas._init();

  $("#reset").click(function (event) {
    canvas.reset();
  })

  $(window).resize(function (event) {
    canvas._setGridAspectRatio();
  })
})

class StartStopButton {

  constructor(id, startFunc, stopFunc) {
    this.button = $("#" + id);
    this.reset();
    this.button.click((event) => {
      if (this.running) {
        stopFunc();
        this.button.text("Resume");
      } else {
        startFunc();
        this.button.text("Stop");
      }
      this.running = !this.running;
    })
  }

  reset() {
    this.running = false;
    this.button.text("Start");
  }
}

class Pixie {
  
  constructor(colors, template) {

    if (typeof colors != "object") {
      _error("colors must be a dictionary mapping " +
          "characters to CSS class strings");
    }
    if (!Array.isArray(template)) {
      _error(`provided template is not an array`);
    }

    this.grid = [];
    this.width = 0;
    this.height = template.length;

    for (let r = 0; r < this.height; ++r) {
      const templateString = template[r];
      if (typeof templateString != "string") {
        _error(`template[${r}] is not a string`);
      }

      const targetRow = [];
      const rowWidth = templateString.length;
      this.width = Math.max(this.width, rowWidth);

      for (let c = 0; c < rowWidth; ++c) {
        const templateChar = templateString[c];
        const color = colors[templateChar];
        if (color === undefined) {
          _error(`could not find color for character '${templateChar}'`)
        }
        if (color !== null && typeof color != "string") {
          _error(`template[${r}]: color for character '${templateChar}' ` +
              "is neither null nor a string");
        }
        targetRow.push(color);
      }
      this.grid.push(targetRow);
    }
  }

  draw(frame, topLeftX, topLeftY) {
    const frameWidth = frame[0].length;
    const frameHeight = frame.length;

    if (topLeftX + this.width < 0 || topLeftX >= frameWidth) {
      return; // not visible in frame
    }
    if (topLeftY + this.height < 0 || topLeftY >= frameHeight) {
      return; // not visible in frame
    }

    for (let r = 0; r < this.height; ++r) {
      const gridRow = this.grid[r];
      for (let c = 0; c < gridRow.length; ++c) {
        const x = topLeftX + c;
        const y = topLeftY + r;
        if (x >= 0 && x < frameWidth && y >= 0 && y < frameHeight) {
          frame[y][x] = gridRow[c];
        }
      }
    }
  }
}

function _error(message) {
  if (errorAlerts) {
    alert("ERROR: " + message);
  }
  throw Error(message);
}
