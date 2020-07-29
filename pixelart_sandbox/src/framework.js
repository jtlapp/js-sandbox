'use strict';

var errorAlerts = false

class PixelArtVars {
  constructor() {

    // configuration

    this.gridWidth = 10 // width of the grid in cells
    this.gridHeight = 10 // height of the grid in cells
    this.delayMillis = 500 // delay between frames in milliseconds

    // cached values

    this.grid1 = null // ref to grid1 for pingponging rendering
    this.grid2 = null // ref to grid2 for pingponging rendering
    this.table1 = null // ref to <table> DOM node in grid1
    this.table2 = null // ref to <table> DOM node in grid2
    this.rows1 = null // ref to array of <tr> DOM nodes in grid1
    this.rows2 = null // ref to array of <tr> DOM nodes in grid2

    // state

    this.timerID = null // timer delaying between frames
    this.frameNumber = 0 // number of frame most recently rendered
  }
}
var _vars = new PixelArtVars()

$(document).ready(function() {

  $("#startstop").click(function (event) {
    if (_vars.timerID == null) {
      _start()
    } else {
      $("#startstop").text("Resume")
      stop()
    }
  })
  $("#reset").click(function (event) {
    reset()
  })
  $(window).resize(function (event) {
    //setTimeout(_setGridAspectRatio, 250)
    _setGridAspectRatio()
  })

  initialize()
  const gridHTML = _createGridHTML()
  _vars.grid1 = $("#grid1")
  _vars.grid1.addClass("hide")
  _vars.grid1.append(gridHTML)
  _vars.table1 = _vars.grid1.children().first()[0]
  _vars.rows1 = _vars.table1.children[0].children
  _vars.grid2 = $("#grid2")
  _vars.grid2.append(gridHTML)
  _vars.table2 = _vars.grid2.children().first()[0]
  _vars.rows2 = _vars.table2.children[0].children
  _setGridAspectRatio()
})

function createMatrix(width, height, initialValue=null) {
  if (width === undefined) {
    width = _vars.gridWidth
    height = _vars.gridHeight
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

function setDelay(delayMilliseconds) {
  _vars.delayMillis = delayMilliseconds
}

function setDimensions(width, height) {
  _vars.gridWidth = width
  _vars.gridHeight = height
}

function reset() {
  const running = (_vars.timerID != null)
  if (running) {
    stop()
  }
  initialize()
  _vars.frameNumber = 0
  if (running) {
    _start()
  } else {
    $("#startstop").text("Start")
    _renderFrame(createMatrix())
  }
}

function stop() {
  if (_vars.timerID == null) {
    _error("can't stop animation because it isn't running")
  }
  clearTimeout(_vars.timerID)
  _vars.timerID = null
}

function _createGridHTML() {
  let html = "<table>\n"
  for (let r = 0; r < _vars.gridWidth; ++r) {
    html += "<tr>"
    for (let c = 0; c < _vars.gridHeight; ++c) {
      html += "<td></td>"
    }
    html += "</tr>\n"
  }
  return html + "</table>\n"
}

function _renderFrame(frame) {
  const oddFrame = (_vars.frameNumber % 2) == 1
  const rows = oddFrame ? _vars.rows1 : _vars.rows2
  for (let r = 0; r < _vars.gridHeight; ++r) {
    const sourceCells = frame[r]
    const targetCells = rows[r].children
    for (let c = 0; c < _vars.gridWidth; ++c) {
      targetCells[c].className = sourceCells[c]
    }
  }
  if (oddFrame) {
    _vars.grid2.addClass("hide")
    _vars.grid1.removeClass("hide")
  } else {
    _vars.grid1.addClass("hide")
    _vars.grid2.removeClass("hide")
  }
  $("#frame_number span").text(_vars.frameNumber)
}

function _renderNextFrame() {
  const frame = makeNextFrame(++_vars.frameNumber)
  if (!Array.isArray(frame)) {
    _error(`provided matrix is not an array`)
  }
  if (frame.length != _vars.gridHeight) {
    _error(`matrix height is ${frame.length} but grid height is ${_vars.gridHeight}`)
  }
  const firstRow = frame[0]
  if (!Array.isArray(firstRow)) {
    _error(`matrix rows are not arrays`)
  }
  if (firstRow.length != _vars.gridWidth) {
    _error(`matrix width is ${firstRow.length} but grid width is ${_vars.gridWidth}`)
  }

  _renderFrame(frame)
  if (_vars.delayMillis > 0) {
    _vars.timerID = setTimeout(_renderNextFrame, _vars.delayMillis)
  }
}

function _setGridAspectRatio() {
  const topOffset = Math.max(_vars.table1.getBoundingClientRect().top,
      _vars.table2.getBoundingClientRect().top);
  _setAspectRatio(_vars.table1, topOffset, _vars.gridWidth, _vars.gridHeight)
  _setAspectRatio(_vars.table2, topOffset, _vars.gridWidth, _vars.gridHeight)
}

function _setAspectRatio(child, topOffset, width, height) {
  // CSS solutions were too hard to make behave as expected
  const aspectRatio = width / height
  let adjustedWidth = window.innerWidth;
  let adjustedHeight = adjustedWidth / aspectRatio;
  if (adjustedHeight + topOffset > window.innerHeight) {
    adjustedHeight = window.innerHeight - topOffset
    adjustedWidth = adjustedHeight * aspectRatio
  }
  child.style.width = adjustedWidth + "px";
  child.style.height = adjustedHeight + "px";
  //console.log("topOffset "+ topOffset)
}

function _start() {
  $("#startstop").text("Stop")
  _renderNextFrame()
}

function _error(message) {
  if (errorAlerts) {
    alert("ERROR: " + message)
  }
  throw Error(message)
}
