class Game {

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
  const initialPositions = [[0,0], [15,0], [30,0]];

  let blocksMap = {};
  let snake;
  let foodBlock;
  let foodBlockPosition;
  let snakeMovementDirection;
  let gameStarted;
  let gameOver;
  let points;
  let snakeMovement;

  reset() {
    gameStarted = false;
    gameOver = false;
    snakeMovementDirection = 'right';
    points = 0;
    setPoints(points);
    clearSnake();
    initialPositions.forEach((coordinates, i) => createNewBlock(...coordinates, i));
    snake = new Snake(initialPositions);
    createFoodBlock();
    gameOverLayer.style.display = 'none';
  }

  clearSnake() {
    for (currentBlock of blocksMap) {
      gameArea.removeChild(currentBlock);
    }
    blocksMap = {};
  }

  createNewBlock(x, y, id) {
    const newBlock = document.createElement('div');
    newBlock.setAttribute('class', 'snake-block');
    newBlock.style.left = x + 'px';
    newBlock.style.top = y + 'px';
    blocksMap[id] = newBlock;
    gameArea.appendChild(newBlock);
  }

  getNewFoodPosition() {
    let x = Math.floor(Math.random() * gameAreaWidth / snakeBlockSize) * snakeBlockSize;
    let y = Math.floor(Math.random() * gameAreaHeight / snakeBlockSize) * snakeBlockSize;
    // check that the food block position doesn't overlap with the position of one of the snake's blocks
    if (snakeBlocks.has(`${x}_${y}`)) {
      for (let dx = 0; dx < gameAreaWidth; dx += snakeBlockSize) {
        for (let dy = 0; dy < gameAreaHeight; dy += snakeBlockSize) {
          if (!snakeBlocks.has(`${(x + dx) % gameAreaWidth}_${(y + dy) % gameAreaHeight}`)) {
            x = (x + dx) % gameAreaWidth;
            y = (y + dy) % gameAreaHeight;
            return [x,y];
          }
        }
      }
    } else {
      return [x,y];
    }
  }

  createFoodBlock() {
    const [x,y] = getNewFoodPosition();
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

  setPoints(n) {
    pointsDiv.innerText = `Points: ${points}`;
  }

  moveSnake(dx, dy) {
    const gameState = snake.move(dx, dy, gameAreaWidth, foodBlockPosition);
    const {foodEaten, gameOver, headId, headPosition} = gameState;
    const snakeHeadDiv = blocksMap[headId];
    const [headX, headY] = headPosition;
    if (gameState['gameOver'] === true) {
      gameOver = true;
      stopGame();
      gameOverLayer.style.display = 'block';
    } else if (gameState['foodEaten'] === true) {
      createNewBlock(headX, headY, headId);
      createFoodBlock();
      setPoints(++points);
    } else {
      snakeHeadDiv.style.left = headX + 'px';
      snakeHeadDiv.style.top = headY + 'px';
    }
  }

  startGame() {
    if (!(gameOver || gameStarted)) {
      gameStarted = true;
      snakeMovement = setInterval(function() {
        switch (snakeMovementDirection) {
          case 'left':
            moveSnake(-snakeBlockSize, 0);
            break;
          case 'up':
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

  stopGame() {
    clearInterval(snakeMovement);
    gameStarted = false;
  }

  f(event) {
    switch (event.which) {
      // the snake cannot invert its course
      case 37:
        if (snakeMovementDirection !== 'right') {
          snakeMovementDirection = 'left';
        }
        break;
      case 38:
        if (snakeMovementDirection !== 'down') {
          snakeMovementDirection = 'up';
        }
        break;
      case 39:
        if (snakeMovementDirection !== 'left') {
          snakeMovementDirection = 'right';
        }
        break;
      case 40:
        if (snakeMovementDirection !== 'up') {
          snakeMovementDirection = 'down';
        }
        break;
    }
  }

}
