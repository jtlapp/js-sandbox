canvasWidth = 10;
canvasHeight = 10;

async function animate() {
  // plot(x, y, color) - color is either null or a CSS class
  // await delay(milliseconds) - pause animation for so many milliseconds
  // swap() - swap between the two drawing grids
  // clear() - clear the current drawing grid

  let millis = 500; // milliseconds
  plot(0, 0, "green");
  await delay(millis);
  plot(1, 1, "green");
  await delay(millis);
  plot(2, 2, "green");
  await delay(millis);
  plot(3, 3, "green");
  await delay(millis);
  plot(4, 4, "green");
  await delay(millis);
}
