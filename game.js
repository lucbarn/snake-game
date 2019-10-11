class Game {

  constructor(gameAreaWidth, gameAreaHeight, snakeBlockSize) {
    this.gameAreaWidth = gameAreaWidth;
    this.gameAreaHeight = gameAreaHeight;
    this.snakeBlockSize = snakeBlockSize;
    this.gameArea = document.getElementById('game-area');
    this.startButton = document.getElementById('start-button');
    this.stopButton = document.getElementById('stop-button');
    this.resetButton = document.getElementById('reset-button');
    this.pointsDiv = document.getElementById('points');
    this.gameOverLayer = document.getElementById('game-over-layer');
    this.initialPositions = [[0,0], [snakeBlockSize,0], [2*snakeBlockSize,0]];
    this.blocksMap = new Map();
    this.gameStarted = false;
    this.gameOver = false;
    this.points = 0;
    this.foodBlock = null;
    this.foodBlockPosition = null;
    this.snake = null;
    this.snakeMovementDirection = null;
    this.snakeMovement = null;
  }

  init() {
    window.addEventListener('keydown', this.f.bind(this));
    this.startButton.addEventListener('click', this.startGame.bind(this));
    this.stopButton.addEventListener('click', this.stopGame.bind(this));
    this.resetButton.addEventListener('click', this.newGame.bind(this));
  }

  newGame() {
    this.gameStarted = false;
    this.gameOver = false;
    this.snakeMovementDirection = 'right';
    this.points = 0;
    this.setPoints(0);
    this.clearSnake();
    this.initialPositions.forEach((coordinates, i) => this.createNewBlock(...coordinates, i));
    this.snake = new Snake(this.initialPositions);
    this.createFoodBlock();
    this.gameOverLayer.style.display = 'none';
  }

  startGame() {
    if (!(this.gameOver || this.gameStarted)) {
      this.gameStarted = true;
      this.snakeMovement = setInterval(() => {
        switch (this.snakeMovementDirection) {
          case 'left':
            this.moveSnake(-this.snakeBlockSize, 0);
            break;
          case 'up':
            this.moveSnake(0, -this.snakeBlockSize);
            break;
          case 'right':
            this.moveSnake(this.snakeBlockSize, 0);
            break;
          case 'down':
            this.moveSnake(0, this.snakeBlockSize);
            break;
        }
      }, 50);
    }
  }

  stopGame() {
    clearInterval(this.snakeMovement);
    this.gameStarted = false;
  }

  clearSnake() {
    for (let [index, currentBlock] of this.blocksMap) {
      this.gameArea.removeChild(currentBlock);
    }
    this.blocksMap.clear();
  }

  createNewBlock(x, y, id) {
    const newBlock = document.createElement('div');
    newBlock.setAttribute('class', 'snake-block');
    newBlock.style.left = x + 'px';
    newBlock.style.top = y + 'px';
    this.blocksMap.set(id, newBlock);
    this.gameArea.appendChild(newBlock);
  }

  getNewFoodPosition() {
    let x = Math.floor(Math.random() * this.gameAreaWidth / this.snakeBlockSize) * this.snakeBlockSize;
    let y = Math.floor(Math.random() * this.gameAreaHeight / this.snakeBlockSize) * this.snakeBlockSize;
    // check that the food block position doesn't overlap with the position of one of the snake's blocks
    // if it does, find the first available position
    if (this.snake.hasBlock(`${x}_${y}`)) {
      for (let dx = 0; dx < this.gameAreaWidth; dx += this.snakeBlockSize) {
        for (let dy = 0; dy < this.gameAreaHeight; dy += this.snakeBlockSize) {
          if (!this.snake.hasBlock(`${(x + dx) % this.gameAreaWidth}_${(y + dy) % this.gameAreaHeight}`)) {
            x = (x + dx) % this.gameAreaWidth;
            y = (y + dy) % this.gameAreaHeight;
            return [x,y];
          }
        }
      }
    } else {
      return [x,y];
    }
  }

  createFoodBlock() {
    const [x,y] = this.getNewFoodPosition();
    const newFoodBlock = document.createElement('div');
    newFoodBlock.setAttribute('class', 'food-block');
    newFoodBlock.style.left = x + 'px';
    newFoodBlock.style.top = y + 'px';
    if (this.foodBlock) {
      this.gameArea.removeChild(this.foodBlock);
    }
    this.foodBlock = newFoodBlock;
    this.foodBlockPosition = [x,y];
    this.gameArea.appendChild(newFoodBlock);
  }

  setPoints(n) {
    this.pointsDiv.innerText = `Points: ${this.points}`;
  }

  moveSnake(dx, dy) {
    const gameState = this.snake.move(dx, dy, this.gameAreaWidth, this.foodBlockPosition);
    const {foodEaten, gameOver, headId, headPosition} = gameState;
    const snakeHeadDiv = this.blocksMap.get(headId);
    const [headX, headY] = headPosition;
    if (gameState['gameOver'] === true) {
      this.gameOver = true;
      this.stopGame();
      this.gameOverLayer.style.display = 'block';
    } else if (gameState['foodEaten'] === true) {
      this.createNewBlock(headX, headY, headId);
      this.createFoodBlock();
      this.setPoints(++this.points);
    } else {
      snakeHeadDiv.style.left = headX + 'px';
      snakeHeadDiv.style.top = headY + 'px';
    }
  }

  f(event) {
    switch (event.which) {
      // the snake cannot invert its course
      case 37:
        if (this.snakeMovementDirection !== 'right') {
          this.snakeMovementDirection = 'left';
        }
        break;
      case 38:
        if (this.snakeMovementDirection !== 'down') {
          this.snakeMovementDirection = 'up';
        }
        break;
      case 39:
        if (this.snakeMovementDirection !== 'left') {
          this.snakeMovementDirection = 'right';
        }
        break;
      case 40:
        if (this.snakeMovementDirection !== 'up') {
          this.snakeMovementDirection = 'down';
        }
        break;
    }
  }

}
