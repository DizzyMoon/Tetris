import Queue from ".Queue.js";

class PieceQueue {
  constructor() {
    this.pieces = new Queue();
  }

  init() {
    const queueContainer = document.getElementById("queue-container");

    const pieceQueue = document.createElement("div");

    pieceQueue.classList.add("piece-queue");

    queueContainer.appendChild(pieceQueue);
  }
}

export default PieceQueue;
