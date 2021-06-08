// Global Variables
let rows = 18;
let cols = 14;
let resolution = 40;
let bombs = 40;
let lost = false;
let won = false;
let board;
let resetButton;

function setup() {
  // Canvas Props
  const cnv = createCanvas(rows * resolution, cols * resolution);
  cnv.style("border", "2px solid black");
  cnv.style("margin", "2% auto 0px auto");
  
  resetButton = createButton("Reset");
  resetButton.mousePressed(reset);

  reset();
}

function draw() {
  background(255);
  drawBoard();
}

// Right Click Event
window.addEventListener("contextmenu", function(event) {
  event.preventDefault();
  
  if (event.which === 3) {
    clicked = createVector(floor(mouseX / resolution), floor(mouseY / resolution));
    
    if (clicked.x <= rows - 1 && clicked.x >= 0 && clicked.y <= cols - 1 && clicked.y >= 0) {
      if (board[clicked.x][clicked.y].cleared == false) {
        if (board[clicked.x][clicked.y].flagged == true) {
          board[clicked.x][clicked.y].flagged = false;
        } else {
          board[clicked.x][clicked.y].flagged = true;
        }
      }
    }
  }
  
  return false;
});

// Left Click Event
window.addEventListener("mousedown", function(event) {
  event.preventDefault();
  
  if (event.which === 1) {
    if (lost === false) {
      clicked = createVector(floor(mouseX / resolution), floor(mouseY / resolution));
      
      if (clicked.x <= rows - 1 && clicked.x >= 0 && clicked.y <= cols - 1 && clicked.y >= 0) {
        if (board[clicked.x][clicked.y].flagged == false) {
          board[clicked.x][clicked.y].surroundingBombs = getSurroundingBombs(board, clicked.x, clicked.y);
          checkBoard();
        }
      }
    }
  }
  
  return false;
});

// Functions
const drawBoard = () => {
  push();
  strokeWeight(2);
  stroke(0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = i * resolution;
      let y = j * resolution;

      if (lost == true && board[i][j].val == "bomb") {
        fill(255, 0, 0);
      } else if (board[i][j].val == "bomb" && board[i][j].cleared == true) {
        fill(255, 0, 0);
      } else if (board[i][j].val != "bomb" && board[i][j].cleared == true) {
        fill(0, 255, 0);
      } else {
        fill(255);
      }
      
      if (won === true) {
        console.log("YOU WON CONGRSATUALIOTNS");
      }

      rect(x, y, resolution);

      strokeWeight(2);
      stroke(0);
      textSize(24);
      textAlign(CENTER, CENTER);
      fill(0);

      if (board[i][j].val != "bomb" && board[i][j].cleared == true && board[i][j].surroundingBombs != 0) {
        text(board[i][j].surroundingBombs, x + resolution / 2, y + resolution / 2);
      }
      
      if (board[i][j].flagged == true) {
        drawFlag(x + resolution / 3, y + resolution / 2, resolution / 3, resolution / 3);
      }
    }
  }
  pop();
}

const checkBoard = () => {
  board[clicked.x][clicked.y].cleared = true;
  
  if (countCleared(board) === rows * cols - bombs) {
    won = true;
  }

  if (board[clicked.x][clicked.y].val == "bomb") {
    lost = true;
  } else {
    revealSurroundingCleared(board, clicked.x, clicked.y);
  }
}

const countCleared = (arr) => {
  let count = 0;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j].cleared === true) {
        count++;
      }
    }
  }
  
  return count;
}

const revealSurroundingCleared = (arr, x, y) => {
  if (arr[x][y].surroundingBombs === 0) {
    for (let xoff = -1; xoff <= 1; xoff++) {
      for (let yoff = -1; yoff <= 1; yoff++) {
        if (x + xoff < rows && x + xoff > -1 && y + yoff < cols && y + yoff > -1 && arr[x + xoff][y + yoff].cleared === false) {
          arr[x + xoff][y + yoff].cleared = true;
          arr[x + xoff][y + yoff].surroundingBombs = getSurroundingBombs(arr, x + xoff, y + yoff);
          if (arr[x + xoff][y + yoff].surroundingBombs === 0) {
            revealSurroundingCleared(arr, x + xoff, y + yoff);
          }
        }
      }
    }
  }
}

const getSurroundingBombs = (arr, x, y) => {
  let count = 0;

  for (let xoff = -1; xoff <= 1; xoff++) {
    for (let yoff = -1; yoff <= 1; yoff++) {
      if (x + xoff < rows && x + xoff > -1 && y + yoff < cols && y + yoff > -1) {
        if (arr[x + xoff][y + yoff].val === "bomb") {
          count++;
        }
      }
    }
  }
  
  return count;
}

const reset = () => {
  board = make2dArray(rows, cols);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        val: 0,
        cleared: false,
        surroundingBombs: 0,
        flagged: false
      };
    }
  }

  for (let i = 0; i < bombs; i++) {
    let randX = floor(random(rows));
    let randY = floor(random(cols));

    while (board[randX][randY].val == "bomb") {
      randX = floor(random(rows));
      randY = floor(random(cols));
    }

    board[randX][randY].val = "bomb";
  }

  lost = false;
}

const drawFlag = (x, y, l, w) => {
  push();
  translate(x, y);
  stroke(0);
  strokeWeight(2);
  fill(255, 0, 0);
  line(0, -l, 0, l);
  triangle(0, 0, 0, -l, w, -l / 2)
  pop();
}

const make2dArray = (rows, cols) => {
  let arr = new Array(rows);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  return arr;
}
