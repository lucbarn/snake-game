const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const pointsDiv = document.getElementById('points');
const gameOverLayer = document.getElementById('game-over-layer');

const gameAreaWidth = 900;
const gameAreaHeight = 600;
const snakeBlockSize = 15;
// initial position of the snake
const initialPosition = [[30,0], [15,0], [0,0]];
const snakeBlocks = new Set();

// array of snake's blocks positions, first element is snake's head
let snakeData = [];
// array of snake's div elements
let snake = [];
let foodBlock;
let foodBlockPosition;
let snakeMovementDirection;
let gameStarted;
let gameOver;
let points;
let snakeMovement;

function reset() {
  gameStarted = false;
  gameOver = false;
  snakeMovementDirection = 'right';
  points = 0;
  setPoints(points);
  clearSnake();
  initialPosition.forEach(coordinates => createNewBlock(...coordinates));
  createFoodBlock();
  gameOverLayer.style.display = 'none';
}

function clearSnake() {
  let currentBlock;
  while (snake.length > 0) {
    currentBlock = snake.pop();
    gameArea.removeChild(currentBlock);
  }
  snakeData = [];
}

function createNewBlock(x,y) {
  let newBlock = document.createElement('div');
  newBlock.setAttribute('class', 'snake-block');
  newBlock.style.left = x + 'px';
  newBlock.style.top = y + 'px';
  snake.push(newBlock);
  snakeData.push([x,y]);
  gameArea.appendChild(newBlock);
  snakeBlocks.add(`${x}_${y}`);
}

function createFoodBlock() {
  let x = Math.floor(Math.random() * gameAreaWidth / snakeBlockSize) * snakeBlockSize;
  let y = Math.floor(Math.random() * gameAreaHeight / snakeBlockSize) * snakeBlockSize;
  // check that the food block position doesn't overlap with the position of one of the snake's blocks
  if (snakeBlocks.has(`${x}_${y}`)) {
    for (let dx = 0; dx < gameAreaWidth; dx += snakeBlockSize) {
      for (let dy = 0; dy < gameAreaHeight; dy += snakeBlockSize) {
        if (!snakeBlocks.has(`${(x + dx) % gameAreaWidth}_${(y + dy) % gameAreaHeight}`)) {
          x = (x + dx) % gameAreaWidth;
          y = (y + dy) % gameAreaHeight;
          break;
        }
      }
    }
  }
  const newFoodBlock = document.createElement('div');
  newFoodBlock.setAttribute('class', 'food-block');
  newFoodBlock.style.left = x + 'px';
  newFoodBlock.style.top = y + 'px';
  if (foodBlock) {
    gameArea.removeChild(foodBlock);
  }
  foodBlock = newFoodBlock;
  foodBlockPosition = [x,y];
  gameArea.appendChild(newFoodBlock);
}

function setPoints(n) {
  pointsDiv.innerText = `Points: ${points}`;
}

function moveSnake(dx, dy) {
  const lastBlockPosition = [snakeData[snakeData.length - 1][0], snakeData[snakeData.length - 1][1]];
  const newBlockPosition = [(gameAreaWidth + snakeData[0][0] + dx) % gameAreaWidth, (gameAreaHeight + snakeData[0][1] + dy) % gameAreaHeight];
  snakeBlocks.delete(`${lastBlockPosition[0]}_${lastBlockPosition[1]}`);
  snakeBlocks.add(`${newBlockPosition[0]}_${newBlockPosition[1]}`);
  snakeData = [newBlockPosition].concat(snakeData.slice(0, snakeData.length - 1));
  // If two snake's blocks overlap, the game is over
  if (snakeBlocks.size < snakeData.length) {
    gameOver = true;
    stopGame();
    gameOverLayer.style.display = 'block';
  }
  // Move tail's block in the head's position
  snake = [snake.pop()].concat(snake);
  snake[0].style.left = snakeData[0][0] + 'px';
  snake[0].style.top = snakeData[0][1] + 'px';
  if ((snakeData[0][0] === foodBlockPosition[0]) && (snakeData[0][1] === foodBlockPosition[1])) {
    createNewBlock(...lastBlockPosition);
    createFoodBlock();
    setPoints(++points);
  }
}

function startGame() {
  if (!(gameOver || gameStarted)) {
    gameStarted = true;
    snakeMovement = setInterval(function() {
      switch (snakeMovementDirection) {
        case 'left':
          moveSnake(-snakeBlockSize, 0);
          break;
        case 'top':
          moveSnake(0, -snakeBlockSize);
          break;
        case 'right':
          moveSnake(snakeBlockSize, 0);
          break;
        case 'down':
          moveSnake(0, snakeBlockSize);
          break;
      }
    }, 50);
  }
}

function stopGame() {
  clearInterval(snakeMovement);
  gameStarted = false;
}

function f(event) {
  switch (event.which) {
    // the snake cannot invert its course
    case 37:
      if (snakeData[0][0] - snakeData[1][0] !== snakeBlockSize) {
        snakeMovementDirection = 'left';
      }
      break;
    case 38:
      if (snakeData[0][1] - snakeData[1][1] !== snakeBlockSize) {
        snakeMovementDirection = 'top';
      }
      break;
    case 39:
      if (snakeData[0][0] - snakeData[1][0] !== -snakeBlockSize) {
        snakeMovementDirection = 'right';
      }
      break;
    case 40:
      if (snakeData[0][1] - snakeData[1][1] !== -snakeBlockSize) {
        snakeMovementDirection = 'down';
      }
      break;
  }
}
