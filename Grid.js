class Grid {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  initGrid() {
    const container = document.getElementById("grid-container");
    for (let i = 0; i < 20; i++) {
      let newRow = document.createElement("div");
      newRow.classList.add("row");
      newRow.classList.add("g-0");
      container.appendChild(newRow);

      for (let j = 0; j < 10; j++) {
        let newCol = document.createElement("div");
        newCol.classList.add("col");
        newRow.appendChild(newCol);

        let newSquare = document.createElement("div");
        newSquare.classList.add("square");
        newCol.appendChild(newSquare);
      }
    }
  }
}

export default Grid;
