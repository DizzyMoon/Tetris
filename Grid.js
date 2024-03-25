class Grid {
  constructor(rows = 20, columns = 10) {
    this.item = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.grid = this.createGrid(rows, columns);
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
    container.innerHTML = ""; // Clear previous content

    this.grid.forEach((row) => {
      const newRow = document.createElement("div");
      newRow.classList.add("row");
      newRow.classList.add("g-0");
      container.appendChild(newRow);

      row.forEach((col) => {
        const newCol = document.createElement("div");
        newCol.classList.add("col");
        newRow.appendChild(newCol);

        const newSquare = document.createElement("div");
        newSquare.classList.add("square");

        if (col === "yellow") {
          newSquare.classList.add("yellow");
        }

        if (col === "cyan") {
          newSquare.classList.add("cyan");
        }

        if (col === "red") {
          newSquare.classList.add("red");
        }

        if (col === "green") {
          newSquare.classList.add("green");
        }

        if (col === "orange") {
          newSquare.classList.add("orange");
        }

        if (col === "pink") {
          newSquare.classList.add("pink");
        }

        if (col === "purple") {
          newSquare.classList.add("purple");
        }

        newCol.appendChild(newSquare);
      });
    });
  }
}

export default Grid;
