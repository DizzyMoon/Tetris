class Grid {
  constructor(rows = 20, columns = 10) {
    this.item = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.rows = rows;
    this.columns = columns;
    this.grid = this.createGrid(rows, columns);
    this.newPieceReady = false;
    // piece shapes
    this.pieceShapes = {
      square: [
        [4, 0],
        [5, 0],
        [4, 1],
        [5, 1],
      ],
      line: [
        [4, 0],
        [4, 1],
        [4, 2],
        [4, 3],
      ],
      z: [
        [3, 0],
        [4, 0],
        [4, 1],
        [5, 1],
      ],
      "z-reverse": [
        [4, 0],
        [5, 0],
        [3, 1],
        [4, 1],
      ],
      l: [
        [4, 0],
        [4, 1],
        [4, 2],
        [5, 2],
      ],
      "l-reverse": [
        [4, 0],
        [4, 1],
        [4, 2],
        [3, 2],
      ],
      t: [
        [3, 0],
        [4, 0],
        [5, 0],
        [4, 1],
      ],
    };
  }

  createGrid(rows, columns) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(Array(columns).fill(null));
    }
    return grid;
  }

  drawGrid(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

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

        //console.log(col);

        if (col !== null) {
          newSquare.style.backgroundColor = col.color;
          if (col.current) {
            newSquare.classList.add("current");
          } else {
            newSquare.classList.remove("current");
          }
        }

        // Check if the current cell is part of the piece shape
        /*
        if (
          pieceShape &&
          pieceShape.some(([r, c]) => r === rowIndex && c === colIndex)
        ) {
          this.replaceElement(rowIndex, colIndex, "current");
          newSquare.classList.add("current-piece");
          newSquare.style.backgroundColor = colorClass;
        }
        */

        newCol.appendChild(newSquare);
        //console.log(this.grid);
      });
    });
  }

  insertNewPiece(nextPieceType) {
    const pieceShape = this.pieceShapes[nextPieceType];
    const color = this.getColorClass(nextPieceType);

    pieceShape.forEach((cell) => {
      const col = cell.at(0);
      const row = cell.at(1);
      let piece = {
        color: color,
        type: nextPieceType,
        current: true,
        position: [],
      };

      piece.position.push(col);
      piece.position.push(row);

      this.replaceElement(row, col, piece);
    });
  }

  replaceElement(row, column, newValue) {
    // Check if the provided indices are within the grid bounds
    if (
      row >= 0 &&
      row < this.grid.length &&
      column >= 0 &&
      column < this.grid[0].length
    ) {
      this.grid[row][column] = newValue;
    } else {
      console.error("Indices are out of bounds.");
    }

    this.drawGrid("grid-container");
  }

  areAnyOutOfBounds(pieces) {
    let outOfBounds = false;

    pieces.forEach((piece) => {
      const newColPos = piece.position[0];
      const newRowPos = piece.position[1] + 1;

      if (newColPos >= this.columns || newColPos < 0) {
        outOfBounds = true;
      }
      if (newRowPos >= this.rows || newRowPos < 0) {
        outOfBounds = true;
      }

      console.log(this.grid[newColPos][newRowPos]);

      if (
        this.grid[newRowPos] &&
        this.grid[newRowPos][newColPos] &&
        this.grid[newRowPos][newColPos] !== null &&
        this.grid[newRowPos][newColPos].hasOwnProperty("current") &&
        !this.grid[newRowPos][newColPos].current
      ) {
        outOfBounds = true;
      }
    });
    return outOfBounds;
  }

  changeNewCurrentPiece(pieceList) {
    pieceList.forEach((piece) => {
      const newPiece = {
        color: piece.color,
        type: piece.type,
        current: false,
        position: piece.position,
      };

      this.replaceElement(piece.position[1], piece.position[0], newPiece);
    });

    this.newPieceReady = true;
  }

  moveCurrentPieceDown() {
    let pieceList = [];
    this.grid.forEach((row) => {
      row.forEach((col) => {
        if (col !== null && col.current) {
          pieceList.push(col);
        }
      });
    });

    if (this.areAnyOutOfBounds(pieceList)) {
      this.changeNewCurrentPiece(pieceList);
      return;
    }

    pieceList.forEach((piece) => {
      const colPos = piece.position[0];
      const rowPos = piece.position[1];
      this.replaceElement(rowPos, colPos, null);
    });

    pieceList.forEach((piece) => {
      const colPos = piece.position[0];
      const rowPos = piece.position[1];

      const newColPos = colPos;
      const newRowPos = rowPos + 1;

      if (newRowPos <= this.grid.length) {
        const newPos = [newColPos, newRowPos];

        let newPiece = {
          color: piece.color,
          type: piece.type,
          current: piece.current,
          position: newPos,
        };
        this.replaceElement(newRowPos, newColPos, newPiece);
      }
    });
  }

  getColorClass(pieceType) {
    const pieceColors = {
      square: "#FFFF44",
      line: "#44FFFF",
      z: "#44FF44",
      "z-reverse": "#FF4545",
      l: "#FF8800",
      "l-reverse": "#E561EE",
      t: "#970096",
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

  getCurrentPiece() {
    let pieceList = [];
    this.grid.forEach((row) => {
      row.forEach((col) => {
        if (col !== null && col.current) {
          pieceList.push(col);
        }
      });
    });
    return pieceList;
  }

  canMoveLeft() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) return;
    let canMove = true;

    pieceList.forEach((piece) => {
      const colPos = piece.position[0];
      const newRowPos = piece.position[1];
      const newColPos = colPos - 1;
      if (newColPos < 0) {
        canMove = false;
      }

      if (this.isOccupied(newColPos, newRowPos)) {
        canMove = false;
      }
    });
    return canMove;
  }

  moveCurrentPieceToLeft() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) return;

    if (this.canMoveLeft()) {
      pieceList.forEach((piece) => {
        const colPos = piece.position[0];
        const rowPos = piece.position[1];
        const newColPos = colPos - 1;
        const newRowPos = rowPos;
        const newPos = [newColPos, newRowPos];

        this.replaceElement(rowPos, colPos, null);
        let newPiece = {
          color: piece.color,
          type: piece.type,
          current: piece.current,
          position: newPos,
        };
        this.replaceElement(newRowPos, newColPos, newPiece);
      });
    } else {
      return;
    }
  }

  canMoveRight() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) return;
    let canMove = true;

    pieceList.forEach((piece) => {
      const colPos = piece.position[0];
      const newColPos = colPos + 1;
      const newRowPos = piece.position[1];
      if (newColPos > this.columns - 1) {
        canMove = false;
      }

      if (this.isOccupied(newColPos, newRowPos)) {
        canMove = false;
      }
    });
    return canMove;
  }

  moveCurrentPieceToRight() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) return;

    if (this.canMoveRight()) {
      pieceList.forEach((piece) => {
        const colPos = piece.position[0];
        const rowPos = piece.position[1];

        this.replaceElement(rowPos, colPos, null);
      });
      pieceList.forEach((piece) => {
        const colPos = piece.position[0];
        const rowPos = piece.position[1];
        const newColPos = colPos + 1;
        const newRowPos = rowPos;
        const newPos = [newColPos, newRowPos];
        let newPiece = {
          color: piece.color,
          type: piece.type,
          current: piece.current,
          position: newPos,
        };
        this.replaceElement(newRowPos, newColPos, newPiece);
      });
    } else {
      return;
    }
  }

  isOccupied(col, row) {
    return (
      this.grid[row] &&
      this.grid[row][col] &&
      this.grid[row][col] !== null &&
      this.grid[row][col].hasOwnProperty("current") &&
      !this.grid[row][col].current
    );
  }

  canMoveDown() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) return;
    let canMove = true;

    pieceList.forEach((piece) => {
      const rowPos = piece.position[1];
      const colPos = piece.position[0];
      const newColPos = colPos;
      const newRowPos = rowPos + 1;

      if (newRowPos > this.rows - 1) {
        canMove = false;
      }

      if (this.isOccupied(newColPos, newRowPos)) {
        canMove = false;
      }
    });
    return canMove;
  }

  moveCurrentPieceToDown() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) return;

    if (this.canMoveDown()) {
      pieceList.forEach((piece) => {
        const colPos = piece.position[0];
        const rowPos = piece.position[1];

        this.replaceElement(rowPos, colPos, null);
      });
      pieceList.forEach((piece) => {
        const colPos = piece.position[0];
        const rowPos = piece.position[1];
        const newColPos = colPos;
        const newRowPos = rowPos + 1;
        const newPos = [newColPos, newRowPos];
        let newPiece = {
          color: piece.color,
          type: piece.type,
          current: piece.current,
          position: newPos,
        };
        this.replaceElement(newRowPos, newColPos, newPiece);
      });
    } else {
      return;
    }
  }
}

export default Grid;
