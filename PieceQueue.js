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

    const frontPiece = this.pieces.peek();
    const img = document.createElement("img");
    img.classList.add("queue-piece");

    switch (frontPiece.type) {
      case "square":
        img.src = "./images/pieces/Square piece.png";
        break;
      case "line":
        img.src = "./images/pieces/Line piece.png";
        break;
      case "z":
        img.src = "./images/pieces/Z piece.png";
        break;
      case "z-reverse":
        img.src = "./images/pieces/Z piece inverted.png";
        break;
      case "l":
        img.src = "./images/pieces/L piece.png";
        break;
      case "l-reverse":
        img.src = "./images/pieces/L piece inverted.png";
        break;
      case "t":
        img.src = "./images/pieces/T piece.png";
        break;
    }

    pieceQueue.appendChild(img);

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

  drawFrontPiece() {
    const frontPiece = this.pieces.peek();
    const img = document.getElementsByClassName("queue-piece");

    switch (frontPiece.type) {
      case "square":
        img.src = "./images/pieces/Square piece.png";
        break;
      case "line":
        img.src = "./images/pieces/Line piece.png";
        break;
      case "z":
        img.src = "./images/pieces/Z piece.png";
        break;
      case "z-reverse":
        img.src = "./images/pieces/Z piece inverted.png";
        break;
      case "l":
        img.src = "./images/pieces/L piece.png";
        break;
      case "l-reverse":
        img.src = "./images/pieces/L piece inverted.png";
        break;
      case "t":
        img.src = "./images/pieces/T piece.png";
        break;
    }
  }

  dequeue() {
    this.pieces.dequeue();
  }
}

export default PieceQueue;
