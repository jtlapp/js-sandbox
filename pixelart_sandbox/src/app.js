var pixie;

function initialize() {
  // canvas.setDimensions(width, height)
  // canvas.setDelay(delayMilliseconds)

  const colors = {
    " ": null,
    "+": "blue",
    "-": "green"
  };
  pixie = new Pixie(colors, [
    " -",
    "-+-",
    " -"
  ]);
  canvas.setDelay(300);
}

function makeNextFrame(frameNumber) {
  // createFrame() - creates frame at size of the grid
  // createFrame(width, height, initialValue=null)
  // reset() - re-initializes and restarts the animation
  // end() - stops the animation

  let f = canvas.createFrame();
  let s = frameNumber % 10;
  pixie.draw(f, s, s);

  // f[s][s] = "blue";
  // f[1][s] = "green";
  // f[8][9-s] = "red";

  return f;
}
