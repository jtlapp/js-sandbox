function initialize() {
  // canvas.setDimensions(width, height)
  // canvas.setDelay(delayMilliseconds)

  canvas.setDelay(250);
}

function makeNextFrame(frameNumber) {
  // createMatrix() - creates matrix at size of grid
  // createMatrix(width, height, initialValue=null)
  // reset() - re-initializes and restarts the animation
  // end() - stops the animation

  let m = canvas.createMatrix();
  let x = (frameNumber - 1) % 10;
  m[x][x] = "green";
  return m
}
