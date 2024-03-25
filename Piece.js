class Piece {
  static types = {
    Square: "square",
    Line: "line",
    Z: "z",
    ZReverse: "z-reverse",
    L: "l",
    LReverse: "l-reverse",
    T: "t",
  };

  constructor(type) {
    this.type = type;
  }

  getRandomType() {
    const typesArray = Object.values(Piece.types);
    const randomIndex = Math.floor(Math.random() * typesArray.length);
    return typesArray[randomIndex];
  }
}

export default Piece;
