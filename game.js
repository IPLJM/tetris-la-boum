let cols = 10;
let rows = 20;
let grid = [];
let current;
let next;
let score = 0;
let blockSize = 30;

function setup() {
  let canvas = createCanvas(cols * blockSize, rows * blockSize);
  canvas.parent("game-container");
  frameRate(5);
  initGrid();
  current = randomPiece();
  next = randomPiece();
}

function draw() {
  background(0);
  drawGrid();
  current.show();
  if (frameCount % 5 === 0) {
    current.move(0, 1);
  }
  drawScore();
}

function initGrid() {
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = 0;
    }
  }
}

function drawGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) {
        fill(grid[y][x]);
        stroke(50);
        rect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    }
  }
}

function drawScore() {
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text("Score: " + score, 10, height - 10);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) current.move(-1, 0);
  else if (keyCode === RIGHT_ARROW) current.move(1, 0);
  else if (keyCode === DOWN_ARROW) current.move(0, 1);
  else if (keyCode === UP_ARROW) current.rotate();
}

function randomPiece() {
  let pieces = [I, J, L, O, S, T, Z];
  let index = floor(random(pieces.length));
  return new Piece(pieces[index]);
}

// Piece class
class Piece {
  constructor(shape) {
    this.shape = shape;
    this.x = 3;
    this.y = 0;
    this.color = color(random(255), random(255), random(255));
  }

  show() {
    fill(this.color);
    stroke(100);
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          rect((this.x + c) * blockSize, (this.y + r) * blockSize, blockSize, blockSize);
        }
      }
    }
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    if (this.collision()) {
      this.x -= dx;
      this.y -= dy;
      if (dy === 1) this.lock();
    }
  }

  rotate() {
    let newShape = [];
    for (let y = 0; y < this.shape[0].length; y++) {
      newShape[y] = [];
      for (let x = 0; x < this.shape.length; x++) {
        newShape[y][x] = this.shape[this.shape.length - 1 - x][y];
      }
    }
    let oldShape = this.shape;
    this.shape = newShape;
    if (this.collision()) this.shape = oldShape;
  }

  collision() {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          let x = this.x + c;
          let y = this.y + r;
          if (x < 0 || x >= cols || y >= rows || (y >= 0 && grid[y][x])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  lock() {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          let x = this.x + c;
          let y = this.y + r;
          if (y >= 0) grid[y][x] = this.color;
        }
      }
    }
    clearLines();
    current = next;
    next = randomPiece();
    if (this.collision()) {
      noLoop(); // Game over
    }
  }
}

function clearLines() {
  for (let y = rows - 1; y >= 0; y--) {
    if (grid[y].every(cell => cell !== 0)) {
      grid.splice(y, 1);
      grid.unshift(Array(cols).fill(0));
      score += 100;
      y++;
    }
  }
}

// Tetromino shapes
const I = [[1, 1, 1, 1]];
const J = [[1, 0, 0], [1, 1, 1]];
const L = [[0, 0, 1], [1, 1, 1]];
const O = [[1, 1], [1, 1]];
const S = [[0, 1, 1], [1, 1, 0]];
const T = [[0, 1, 0], [1, 1, 1]];
const Z = [[1, 1, 0], [0, 1, 1]];
