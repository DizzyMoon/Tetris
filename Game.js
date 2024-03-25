import Grid from "./Grid.js";
import PieceQueue from "./PieceQueue.js";

("use strict");

class Game {
  constructor() {}

  tickSpeed = 1;

  start() {
    const grid = new Grid();
    const pieceQueue = new PieceQueue();

    grid.createGrid();
    grid.drawGrid("grid-container");
    pieceQueue.init();
  }
}

export default Game;
