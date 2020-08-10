canvasWidth = 10;
canvasHeight = 10;
delayMilliseconds = 500;
enforceBoundaries = true;

async function animate() {
  // plot(x, y, color) - color is either null or a CSS class
  // await delay() - pause animation for delayMilliseconds
  // swap() - swap between the two drawing grids
  // clear() - clear the current drawing grid

  plot(0, 0, "green");
  await delay();
  plot(1, 1, "green");
  await delay();
  plot(2, 2, "green");
  await delay();
  plot(3, 3, "green");
  await delay();
  plot(4, 4, "green");
  await delay();
}
