import Grid from "./Grid.js";
import PieceQueue from "./PieceQueue.js";

"use strict";

class Game {
  constructor() {}

  tickSpeed = 1;

  start() {
    const grid = new Grid();
    const pieceQueue = new PieceQueue();

    pieceQueue.init();

    // next piece from the queue piece
    const nextPieceType = pieceQueue.getNextPieceType();

    grid.createGrid();
    grid.drawGrid("grid-container", nextPieceType);
  }
}

export default Game;
