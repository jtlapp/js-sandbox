function initialize() {
  // canvas.setDimensions(width, height)
  // canvas.setDelay(delayMilliseconds)

  canvas.setDelay(500);
}

function makeNextFrame(frameNumber) {
  // createFrame() - creates frame at size of the grid
  // createFrame(width, height, initialColor=null)
  // reset() - re-initializes and restarts the animation
  // end() - stops the animation

  let f = canvas.createFrame();
  let s = frameNumber % 10;
  f[s][s] = "blue";
  f[1][s] = "green";
  f[8][9-s] = "red";
  return f;
}
