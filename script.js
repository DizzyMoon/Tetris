"use strict";

import Grid from "./Grid.js";
import PieceQueue from "./PieceQueue.js";

window.addEventListener("DOMContentLoaded", start);

let fallSpeed = 1;

function start() {
  const grid = new Grid();
  const pieceQueue = new PieceQueue();

  grid.initGrid();
  pieceQueue.init();

  console.log("Javascript is running :)");
}
