let grid = [];
let score = 0;
let bestScore = localStorage.getItem("best") || 0;
let gameMode = "classic";
let chrono = 0;
let chronoInterval;
let undoStack = [];
let skin = "numbers";

// 🎭 Skins
const skins = {
  numbers: num => num,
  animals: {2:"🐣",4:"🐥",8:"🐓",16:"🐔",32:"🦆",64:"🦉",128:"🦅",256:"🦖",512:"🐉",1024:"🐲",2048:"🐼"},
  food: {2:"🍏",4:"🍎",8:"🍐",16:"🍊",32:"🍋",64:"🍌",128:"🍉",256:"🍇",512:"🍓",1024:"🍒",2048:"🍍"},
  gaming: {2:"🕹️",4:"🎮",8:"💿",16:"👾",32:"⚡",64:"💎",128:"🔥",256:"🏆",512:"🎲",1024:"🔮",2048:"👑"}
};

// 🎮 Lancer le jeu
function startGame(mode){
  gameMode = mode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  skin = document.getElementById("skin-select").value;
  score = 0;
  chrono = 0;
  updateUI();
  initGrid();
  if(mode === "chrono"){
    clearInterval(chronoInterval);
    chronoInterval = setInterval(()=> {
      chrono++;
      document.getElementById("chrono").innerText = `⏱️ ${chrono}s`;
    },1000);
  }
}

// Retour menu
function goToMenu(){
  clearInterval(chronoInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

// Initialiser la grille
function initGrid(){
  grid = Array(4).fill(null).map(()=> Array(4).fill(0));
  addTile();
  addTile();
  renderGrid();
}

// Ajouter une tuile
function addTile(){
  let empty = [];
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(grid[r][c]===0) empty.push({r,c});
    }
  }
  if(empty.length === 0) return;
  let {r,c} = empty[Math.floor(Math.random()*empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// Afficher la grille
function renderGrid(){
  const container = document.getElementById("grid");
  container.innerHTML = "";
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      let val = grid[r][c];
      const div = document.createElement("div");
      div.className = "tile";
      if(val !== 0){
        div.innerText = getSkin(val);
      }
      container.appendChild(div);
    }
  }
  updateUI();
}

function getSkin(val){
  if(skin === "numbers") return val;
  let set = skins[skin];
  return set[val] || val;
}

// UI update
function updateUI(){
  document.getElementById("score").innerText = `Score: ${score}`;
  document.getElementById("best").innerText = `Best: ${bestScore}`;
}

// Undo
function undoMove(){
  if(undoStack.length){
    let state = undoStack.pop();
    grid = JSON.parse(state.grid);
    score = state.score;
    renderGrid();
  }
}

// Gestion clavier
document.addEventListener("keydown", e => {
  let moved = false;
  if(e.key === "ArrowUp") moved = move("up");
  if(e.key === "ArrowDown") moved = move("down");
  if(e.key === "ArrowLeft") moved = move("left");
  if(e.key === "ArrowRight") moved = move("right");
  if(moved) {
    addTile();
    renderGrid();
  }
});

// 📱 Gestion tactile mobile
let startX, startY;
document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if(Math.abs(dx) > Math.abs(dy)){
    if(dx > 30) move("right");
    if(dx < -30) move("left");
  } else {
    if(dy > 30) move("down");
    if(dy < -30) move("up");
  }
  renderGrid();
});

// Déplacements
function move(dir){
  let moved = false;
  undoStack.push({grid: JSON.stringify(grid), score});
  let newGrid = JSON.parse(JSON.stringify(grid));
  for(let r=0;r<4;r++){
    let row = [];
    for(let c=0;c<4;c++){
      let val = dir==="left"||dir==="right"?grid[r][c]:grid[c][r];
      if(val !== 0) row.push(val);
    }
    if(dir==="right"||dir==="down") row.reverse();
    for(let i=0;i<row.length-1;i++){
      if(row[i]===row[i+1]){
        row[i]*=2;
        score+=row[i];
        row.splice(i+1,1);
      }
    }
    while(row.length<4) row.push(0);
    if(dir==="right"||dir==="down") row.reverse();
    for(let c=0;c<4;c++){
      if(dir==="left"||dir==="right") newGrid[r][c] = row[c];
      else newGrid[c][r] = row[c];
    }
  }
  if(JSON.stringify(grid)!==JSON.stringify(newGrid)){
    grid=newGrid;
    moved=true;
    if(score>bestScore){
      bestScore=score;
      localStorage.setItem("best",bestScore);
    }
  }
  return moved;
}
