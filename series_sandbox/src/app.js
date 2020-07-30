canvasWidth = 10;
canvasHeight = 10;

async function animate() {
  // plot(x, y, color) - color is either null or a CSS class
  // await wait(milliseconds) - pause animation for so many milliseconds
  // swap() - swap between the two drawing grids
  // clear() - clear the current drawing grid

  let delay = 500; // milliseconds
  plot(3, 3, "green");
  await wait(delay);
  clear();
  plot(4, 4, "green");
  await wait(delay);
  clear();
  plot(5, 5, "green");
  await wait(delay);
  clear();
  plot(6, 6, "green");
  await wait(delay);
  clear();
  plot(7, 7, "green");
  await wait(delay);
}
