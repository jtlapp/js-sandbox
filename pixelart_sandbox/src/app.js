function initialize() {
  // setDimensions(width, height)
  canvas.setDelay(250)
}

function makeNextFrame(frameNumber) {
  let m = canvas.createMatrix()
  let x = (frameNumber - 1) % 10
  m[x][x] = "green"
  m[0][8] = "green"
  m[0][9] = "green"
  m[1][8] = "green"
  m[1][9] = "green"
  return m
}
