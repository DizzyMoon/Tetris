import Queue from "./Queue.js";
import Piece from "./Piece.js";

class PieceQueue {
  constructor() {
    this.pieces = new Queue();
  }

  init() {
    const queueContainer = document.getElementById("queue-container");
    const pieceQueue = document.createElement("div");
    pieceQueue.classList.add("piece-queue");
    queueContainer.appendChild(pieceQueue);

    for (let i = 0; i < 10; i++) {
      let piece = new Piece();
      const type = piece.getRandomType();
      piece.type = type;
      this.pieces.enqueue(piece);
    }

    console.log(this.pieces);
  }

  run() {
    while (this.pieces.length < 10) {
      let piece = new Piece();
      const type = piece.getRandomType();
      piece.type = type;
      this.pieces.enqueue(piece);
    }
  }

  dequeue() {
    this.pieces.dequeue();
  }
}

export default PieceQueue;
