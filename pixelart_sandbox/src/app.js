function initialize() {
  // setDimensions(width, height)
  canvas.setDelay(250);
}

function makeNextFrame(frameNumber) {
  let m = canvas.createMatrix();
  let x = (frameNumber - 1) % 10;
  m[x][x] = "green";
  return m
}
