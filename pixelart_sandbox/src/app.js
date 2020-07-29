var pixie;

function initialize() {
  // canvas.setDimensions(width, height)
  // canvas.setDelay(delayMilliseconds)

  const colors = {
    " ": null,
    "+": "blue",
    "-": "green"
  }
  pixie = new Pixie(colors, [
    " -",
    "-+-",
    " -"
  ])
  canvas.setDelay(300);
}

function makeNextFrame(frameNumber) {
  // createMatrix() - creates matrix at size of grid
  // createMatrix(width, height, initialValue=null)
  // reset() - re-initializes and restarts the animation
  // end() - stops the animation

  let m = canvas.createMatrix();
  let x = (frameNumber - 1) % 10;
  pixie.draw(m, x, x);
  //m[x][x] = "green";
  return m
}
