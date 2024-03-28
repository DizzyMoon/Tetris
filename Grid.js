class Grid {
  constructor(rows = 20, columns = 10) {
    this.item = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.grid = this.createGrid(rows, columns);
    // piece shapes
    this.pieceShapes = {
      "square": [[0, 4], [0, 5], [1, 4], [1, 5]],
      "line": [[0, 4], [1, 4], [2, 4], [3, 4]],
      "z": [[0, 3], [0, 4], [1, 4], [1, 5]],
      "zReverse": [[0, 4], [0, 5], [1, 3], [1, 4]],
      "l": [[0, 4], [1, 4], [2, 4], [2, 5]],
      "lReverse": [[0, 4], [1, 4], [2, 4], [2, 3]],
      "t": [[0, 3], [0, 4], [0, 5], [1, 4]]
    };
  }

  createGrid(rows, columns) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(Array(columns).fill(null));
    }
    return grid;
  }

  drawGrid(containerId, nextPieceType) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    // Get the shape of the next piece type
    const pieceShape = this.pieceShapes[nextPieceType];
    const colorClass = this.getColorClass(nextPieceType);

    this.grid.forEach((row, rowIndex) => {
      const newRow = document.createElement("div");
      newRow.classList.add("row");
      newRow.classList.add("g-0");
      container.appendChild(newRow);

      row.forEach((col, colIndex) => {
        const newCol = document.createElement("div");
        newCol.classList.add("col");
        newRow.appendChild(newCol);

        const newSquare = document.createElement("div");
        newSquare.classList.add("square");

        // Check if the current cell is part of the piece shape
        if (pieceShape && pieceShape.some(([r, c]) => r === rowIndex && c === colIndex)) {
          newSquare.style.backgroundColor = colorClass;
        }

        newCol.appendChild(newSquare);
      });
    });
  }

  getColorClass(pieceType) {
    const pieceColors = {
      "square": "#FFFF44",
      "line": "#44FFFF",
      "z": "#44FF44",
      "zReverse": "#FF4545",
      "l": "#FF8800",
      "lReverse": "#E561EE",
      "t": "#970096"
    };

    if (pieceColors.hasOwnProperty(pieceType)) {
      return pieceColors[pieceType];
    }
  }

  setPiece(row, column, pieceType) {
    this.grid[row][column] = pieceType;
  }

  clearPiece(row, column) {
    this.grid[row][column] = null;
  }
}

export default Grid;