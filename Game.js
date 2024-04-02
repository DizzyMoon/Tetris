import Grid from "./Grid.js";
import PieceQueue from "./PieceQueue.js";

("use strict");

class Game {
  constructor() { }

  tickSpeed = 500;
  grid = new Grid();
  pieceQueue = new PieceQueue();

  start() {
    this.initControls();
    // next piece from the queue piece
    this.pieceQueue.drawQueue();
    const nextPieceType = this.pieceQueue.getNextPieceType();

    this.grid.createGrid();
    this.grid.insertNewPiece(nextPieceType);
    this.pieceQueue.dequeue();

    this.gameLoop = setInterval(() => {
      this.update();
    }, this.tickSpeed);
  }

  update() {
    this.grid.drawGrid("grid-container");
    this.grid.moveCurrentPieceDown();
    if (this.grid.newPieceReady) {
      this.pieceQueue.drawQueue();
      const nextPieceType = this.pieceQueue.getNextPieceType();
      this.grid.insertNewPiece(nextPieceType);
      this.pieceQueue.dequeue();
      this.grid.newPieceReady = false;
    }
    console.log(this.grid);
  }

  // keyboard input arrow keys 
  initControls() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.grid.moveCurrentPieceToLeft();
          break;
        case "ArrowRight":
          this.grid.moveCurrentPieceToRight();
          break;
        case "ArrowDown":
          this.grid.moveCurrentPieceToDown();
          break;
      }
    });
  }
}

export default Game;
