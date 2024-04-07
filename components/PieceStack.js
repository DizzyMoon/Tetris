import Stack from "./Stack.js";
import Piece from "./Piece.js";

class PieceStack {
  constructor() {
    this.pieces = new Stack();
  }

  add(piece) {
    this.pieces.add(piece);
  }

  removePiece() {
    this.pieces.removePiece();
  }

  peek() {
    return this.pieces.peek();
  }

  isEmpty() {
    return this.pieces.isEmpty();
  }

  remove() {
    this.pieces.remove();
  }
  drawStack() {
    const stackContainer = document.getElementById("stack-container");
    stackContainer.innerHTML = "";
    const pieceStack = document.createElement("div");
    pieceStack.classList.add("piece-stack");
    stackContainer.appendChild(pieceStack);

    if (this.pieces.peek()) {
      const frontPiece = this.pieces.peek();
      const img = document.createElement("img");
      img.classList.add("stack-piece");

      switch (frontPiece) {
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
      pieceStack.appendChild(img);
    }
  }

  drawFrontPiece() {
    const frontPiece = this.pieces.peek();
    const img = document.getElementsByClassName("stack-piece");

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
}

export default PieceStack;
