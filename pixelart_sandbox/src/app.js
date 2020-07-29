function initialize() {
  // setDimensions(width, height)
  setDelay(250)
}

function makeNextFrame(frameNumber) {
  let m = createMatrix()
  let x = (frameNumber - 1) % 10
  m[x][x] = "green"
  m[0][8] = "green"
  m[0][9] = "green"
  m[1][8] = "green"
  m[1][9] = "green"
  return m
}
