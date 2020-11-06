// Global Variables
let rows = 18;
let cols = 14;
let resolution = 40;
let bombs = 40;
let lost = false;
let board;

function setup() {
  // Canvas Props
  const cnv = createCanvas(rows * resolution, cols * resolution);
  cnv.style("border", "2px solid black");
  cnv.style("margin", "2% auto 0px auto");

  board = make2dArray(rows, cols);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      board[j][i] = {
        val: 0,
        cleared: false,
        surroundingBombs: 0
      };
    }
  }

  for (let i = 0; i < bombs; i++) {
    let randX = floor(random(cols));
    let randY = floor(random(rows));

    while (board[randX][randY].val == "bomb") {
      randX = floor(random(cols));
      randY = floor(random(rows));
    }

    board[randX][randY].val = "bomb";
  }
}

function draw() {
  background(255);

  drawBoard();
}

// Functions
function mousePressed() {
  if (lost != true) {
    clicked = createVector(floor(mouseX / resolution), floor(mouseY / resolution));

    if (clicked.x > rows - 1 || clicked.x < 0 || clicked.y > cols - 1 || clicked.y < 0) {
      clicked.x = rows - 1;
    } else {
      board[clicked.y][clicked.x].surroundingBombs = surroundingBombs(board, clicked.y, clicked.x);
      checkBoard();
    }
  }
}

const drawBoard = () => {
  push();
  strokeWeight(2);
  stroke(0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = i * resolution;
      let y = j * resolution;

      if (lost == true && board[j][i].val == "bomb") {
        fill(255, 0, 0);
      } else if (board[j][i].val == "bomb" && board[j][i].cleared == true) {
        fill(255, 0, 0);
      } else if (board[j][i].val != "bomb" && board[j][i].cleared == true) {
        fill(0, 255, 0);
      } else {
        fill(255);
      }

      rect(x, y, resolution, resolution);

      strokeWeight(2);
      stroke(0);
      textSize(24);
      textAlign(CENTER, CENTER);
      fill(0);

      if (board[j][i].val != "bomb" && board[j][i].cleared == true && board[j][i].surroundingBombs != 0) {
        text(board[j][i].surroundingBombs, x + resolution / 2, y + resolution / 2);
      }
    }
  }

  pop();
}

const checkBoard = () => {
  board[clicked.y][clicked.x].cleared = true;

  if (board[clicked.y][clicked.x].val == "bomb") {
    lost = true;
  }
}

const surroundingBombs = (arr, x, y) => {
  let count = 0;

  try {
    if (arr[x - 1][y + 1].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x][y + 1].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x + 1][y + 1].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x - 1][y].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x + 1][y].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x - 1][y - 1].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x][y - 1].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  try {
    if (arr[x + 1][y - 1].val == "bomb") {
      count++;
    }
  } catch (err) {

  }

  return count;
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
  let arr = new Array(cols);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}
