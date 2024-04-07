class Grid {
  constructor(rows = 20, columns = 10) {
    this.item = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.rows = rows;
    this.columns = columns;
    this.grid = this.createGrid(rows, columns);
    this.newPieceReady = false;
    this.gameOver = false;
    this.totalClearedLines = 0;
    this.lastClearedLine = 0;
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

  gameOverAnimation(callback) {
    let animation;
    let i = this.grid.length - 1;
    let j = this.grid[i].length - 1;

    const animate = () => {
      const newPiece = {
        color: "#850101",
        type: "l",
        current: false,
        position: [j, i],
      };
      this.replaceElement(newPiece.position[1], newPiece.position[0], newPiece);

      if (j > 0) {
        j--;
      } else {
        j = this.grid[i].length - 1;
        i--;
      }

      if (i < 0) {
        clearInterval(animation);
        console.log("Animation done :)");
        // Call the callback function when animation is complete
        if (callback && typeof callback === "function") {
          callback();
        }
      }
    };

    animate();
    animation = setInterval(animate, 1);
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

        if (col !== null) {
          newSquare.style.backgroundColor = col.color;
          if (col.current) {
            newSquare.classList.add("current");
          } else {
            newSquare.classList.remove("current");
          }
        }

        newCol.appendChild(newSquare);
      });
    });
  }

  insertNewPiece(nextPieceType) {
    this.lastClearedLine = 0;
    if (this.checkForLines()) {
      this.lastClearedLine++;
      this.clearLines();
      this.moveNonCurrentsDown();
    }
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

      if (this.grid[row][col] !== null) {
        this.gameOver = true;
      }
      this.replaceElement(row, col, piece);
    });

    return this.lastClearedLine;
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

  removeCurrentPiece() {
    let found = 0;
    this.grid.forEach((column) => {
      column.forEach((piece) => {
        if (piece !== null && piece.current && found < 4) {
          this.replaceElement(piece.position[1], piece.position[0], null);
          found++;
        }
      });
    });
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

  canRotate(rotatedPieces) {
    let canRotate = true;

    rotatedPieces.forEach((piece) => {
      if (piece.position[0] <= 0 || piece.position[0] >= this.columns) {
        canRotate = false;
      }
      if (piece.position[1] <= 0 || piece.position[1] >= this.rows) {
        canRotate = false;
      }

      if (this.isOccupied(piece.position[0], piece.position[1])) {
        canRotate = false;
      }
    });

    return canRotate;
  }

  onRotatePress() {
    const pieceList = this.getCurrentPiece();
    if (!pieceList) {
      return;
    }
    //const rotatedPieces = this.rotatePieceClockwise(pieceList);
    const rotatedPieces = this.rotate(pieceList, 90);

    if (this.canRotate(rotatedPieces)) {
      pieceList.forEach((piece) => {
        const colPos = piece.position[0];
        const rowPos = piece.position[1];

        this.replaceElement(rowPos, colPos, null);
      });
      rotatedPieces.forEach((piece) => {
        this.replaceElement(piece.position[1], piece.position[0], piece);
      });
    }
  }

  rotate(pieceList, degrees) {
    let radians = (degrees * Math.PI) / 180; // Convert degrees to radians
    let rotatedPieces = [];

    let origin = pieceList.reduce(
      (acc, piece) => [acc[0] + piece.position[0], acc[1] + piece.position[1]],
      [0, 0]
    );
    origin[0] /= pieceList.length;
    origin[1] /= pieceList.length;

    for (let i = 0; i < pieceList.length; i++) {
      let x0 = pieceList[i].position[0] - origin[0];
      let y0 = pieceList[i].position[1] - origin[1];

      let xPrime = Math.round(
        x0 * Math.cos(radians) - y0 * Math.sin(radians) + origin[0]
      );
      let yPrime = Math.round(
        x0 * Math.sin(radians) + y0 * Math.cos(radians) + origin[1]
      );

      const rotatedPiece = {
        color: pieceList[i].color,
        position: [xPrime, yPrime],
        current: pieceList[i].current,
        type: pieceList[i].type,
      };

      rotatedPieces.push(rotatedPiece);
    }

    return rotatedPieces;
  }

  moveNonCurrentsDown() {
    for (let i = this.grid.length - 1; i >= 0; i--) {
      for (let j = this.grid[i].length - 1; j >= 0; j--) {
        if (this.grid[i][j] !== null) {
          let x = this.grid[i][j].position[0];
          let y = this.grid[i][j].position[1];
          let xN = this.grid[i][j].position[0];
          let yN = this.grid[i][j].position[1] + 1;

          if (this.grid[i] && this.grid[i][j] && this.grid[i][j] !== null) {
            while (yN <= this.rows - 1 && this.grid[yN][xN] === null) {
              const newPiece = this.grid[y][x];
              this.replaceElement(y, x, null);
              this.replaceElement(yN, xN, newPiece);
              x = xN;
              y = yN;
              xN = x;
              yN = y + 1;
            }
          }
        }
      }
    }

    if (this.checkForLines()) {
      this.clearLines();
      this.lastClearedLine++;
      this.moveNonCurrentsDown();
    }
  }

  containsNull(array) {
    for (let element of array) {
      if (element === null) {
        return true;
      }
    }
    return false;
  }

  checkForLines() {
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i];
      let lineCompleted = true;
      for (let j = 0; j < row.length; j++) {
        if (row[j] === null) {
          lineCompleted = false;
          break; // If any cell in the row is null, move to the next row
        }
      }
      if (lineCompleted) {
        return true; // If a completed line is found, return true
      }
    }
    return false; // If no completed lines are found, return false
  }

  clearLines() {
    let numberOfLines = 0;

    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i];
      let lineCompleted = true;
      for (let j = 0; j < row.length; j++) {
        if (row[j] === null) {
          lineCompleted = false;
          break;
        }
      }
      if (lineCompleted) {
        numberOfLines++;
        for (let j = 0; j < row.length; j++) {
          this.grid[i][j] = null;
        }
        for (let k = i; k > 0; k--) {
          this.grid[k] = this.grid[k - 1];
        }
        this.grid[0] = Array(this.columns).fill(null);
        this.drawGrid("grid-container");
        break;
      }
    }

    this.totalClearedLines += numberOfLines; // Accumulate the count of cleared lines
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
