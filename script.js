const snakeBlockSize = 15;
const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
let gameAreaWidth = 900;
let gameAreaHeight = 600;
const initialPosition = [0,0];
let snakeData = [];
let snake = [];
let foodBlock;
let foodBlockPosition;
let snakeMovementDirection = 'right';
let gameOver = false;
const snakeBlocks = new Set();

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
    let found = false;
    for (let dx = 1; dx < gameAreaWidth; dx++) {
      if (found) {
        break;
      }
      for (let dy = 1; dy < gameAreaHeight; dy++) {
        if (!snakeBlocks.has(`${(x + dx) % gameAreaWidth}_${(y + dy) % gameAreaHeight}`)) {
          x = (x + dx) % gameAreaWidth;
          y = (y + dy) % gameAreaHeight;
          found = true;
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

function moveSnake(dx, dy) {
  const lastBlockPosition = [snakeData[snakeData.length - 1][0], snakeData[snakeData.length - 1][1]];
  const newBlockPosition = [(gameAreaWidth + snakeData[0][0] + dx) % gameAreaWidth, (gameAreaHeight + snakeData[0][1] + dy) % gameAreaHeight];
  snakeBlocks.delete(`${lastBlockPosition[0]}_${lastBlockPosition[1]}`);
  snakeBlocks.add(`${newBlockPosition[0]}_${newBlockPosition[1]}`);
  snakeData = [newBlockPosition].concat(snakeData.slice(0, snakeData.length - 1));
  for (let i = 0; i < snakeData.length; i++) {
    if ((i > 0) && (snakeData[0][0] === snakeData[i][0]) && (snakeData[0][1] === snakeData[i][1])) {
      gameOver = true;
      stopGame();
    }
    snake[i].style.left = snakeData[i][0] + 'px';
    snake[i].style.top = snakeData[i][1] + 'px';
  }
  if ((snakeData[0][0] === foodBlockPosition[0]) && (snakeData[0][1] === foodBlockPosition[1])) {
    createNewBlock(...lastBlockPosition);
    createFoodBlock();
  }
}

createNewBlock(...initialPosition);
createFoodBlock();

let snakeMovement;

function startGame() {
  if (!gameOver) {
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
}

function f(event) {
  switch (event.which) {
    // the snake cannot invert its course
    case 37:
      if ((snakeData.length === 1) || (snakeData[0][0] - snakeData[1][0] !== snakeBlockSize)) {
        snakeMovementDirection = 'left';
      }
      break;
    case 38:
      if ((snakeData.length === 1) || (snakeData[0][1] - snakeData[1][1] !== snakeBlockSize)) {
        snakeMovementDirection = 'top';
      }
      break;
    case 39:
      if ((snakeData.length === 1) || (snakeData[0][0] - snakeData[1][0] !== -snakeBlockSize)) {
        snakeMovementDirection = 'right';
      }
      break;
    case 40:
      if ((snakeData.length === 1) || (snakeData[0][1] - snakeData[1][1] !== -snakeBlockSize)) {
        snakeMovementDirection = 'down';
      }
      break;
  }
}

window.addEventListener('keydown', f);
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
