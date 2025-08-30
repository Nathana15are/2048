const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
let score = 0;

// Initialiser une grille 4x4 remplie de 0
let grid = Array(4).fill().map(() => Array(4).fill(0));

function initGame() {
  addRandomTile();
  addRandomTile();
  drawGrid();
}

function addRandomTile() {
  let emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  if (emptyCells.length > 0) {
    let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[r][c] = Math.random() > 0.1 ? 2 : 4;
  }
}

function drawGrid() {
  gridContainer.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (grid[r][c] !== 0) {
        cell.textContent = grid[r][c];
        cell.setAttribute("data-value", grid[r][c]);
      }
      gridContainer.appendChild(cell);
    }
  }
  scoreDisplay.textContent = score;
}

function slide(row) {
  row = row.filter(val => val); 
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(val => val);
  while (row.length < 4) row.push(0);
  return row;
}

function rotateGrid(grid) {
  let newGrid = Array(4).fill().map(() => Array(4).fill(0));
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      newGrid[r][c] = grid[c][3 - r];
    }
  }
  return newGrid;
}

function moveLeft() {
  let newGrid = [];
  for (let r = 0; r < 4; r++) {
    newGrid.push(slide(grid[r]));
  }
  grid = newGrid;
  addRandomTile();
  drawGrid();
}

function moveRight() {
  grid = grid.map(row => row.reverse());
  moveLeft();
  grid = grid.map(row => row.reverse());
}

function moveUp() {
  grid = rotateGrid(grid);
  moveRight();
  grid = rotateGrid(rotateGrid(rotateGrid(grid)));
}

function moveDown() {
  grid = rotateGrid(grid);
  moveLeft();
  grid = rotateGrid(rotateGrid(rotateGrid(grid)));
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

initGame();
