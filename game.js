class Game {

  constructor(gameAreaWidth, gameAreaHeight, snakeBlockSize, initialPositions) {
    this.gameAreaWidth = gameAreaWidth;
    this.gameAreaHeight = gameAreaHeight;
    this.snakeBlockSize = snakeBlockSize;
    this.gameArea = document.getElementById('game-area');
    this.startButton = document.getElementById('start-button');
    this.stopButton = document.getElementById('stop-button');
    this.autoplayButton = document.getElementById('autoplay-button');
    this.newGameButton = document.getElementById('new-game-button');
    this.pointsDiv = document.getElementById('points');
    this.gameOverLayer = document.getElementById('game-over-layer');
    this.snakeMovingTail = document.getElementById('moving-tail');
    this.snakeMovingTailContainer = document.getElementById('moving-tail-container');
    this.snakeMovingHead = document.getElementById('moving-head');
    this.snakeMovingHeadContainer = document.getElementById('moving-head-container');
    this.initialPositions = initialPositions;
    this.blocksMap = new Map();
    this.gameStarted = false;
    this.gameOver = false;
    this.autoplay = false;
    this.nextMoves = [];
    this.points = 0;
    this.foodBlock = null;
    this.foodBlockPosition = null;
    this.snake = null;
    this.snakeMovement = null;
    this.snakeOldHead = null;
  }

  init() {
    if (!this.autoplay) {
      window.addEventListener('keydown', this.f.bind(this));
    }
    this.startButton.addEventListener('click', this.startGame.bind(this));
    this.stopButton.addEventListener('click', this.stopGame.bind(this));
    this.autoplayButton.addEventListener('click', this.startAutoplay.bind(this));
    this.newGameButton.addEventListener('click', this.newGame.bind(this));
  }

  newGame() {
    this.gameStarted = false;
    this.gameOver = false;
    this.autoplay = false;
    this.points = 0;
    this.setPoints(0);
    this.clearSnake();
    this.initialPositions.forEach((coordinates, i) => this.createNewBlock(...coordinates, i));
    this.snake = new Snake(this.initialPositions, this.snakeBlockSize, 'right');
    this.snakeMovingTailContainer.style.left = this.initialPositions[0][0] + 'px';
    this.snakeMovingTailContainer.style.top = this.initialPositions[0][1] + 'px';
    this.snakeMovingHeadContainer.style.left = this.initialPositions[this.initialPositions.length-1][0] + 'px';
    this.snakeMovingHeadContainer.style.top = this.initialPositions[this.initialPositions.length-1][1] + 'px';
    this.createFoodBlock();
    this.gameOverLayer.style.display = 'none';
  }

  startGame() {
    if (!(this.gameOver || this.gameStarted)) {
      this.gameStarted = true;
      this.snakeMovement = setInterval(() => {
        if (this.autoplay && this.nextMoves.length > 0) {
          this.snake.movementDirection = this.nextMoves.pop();
        }
        switch (this.snake.movementDirection) {
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

  startAutoplay() {
    this.stopGame();
    this.newGame();
    this.autoplay = true;
    this.nextMoves = this.snake.nextMoves(this.snakeBlockSize, this.gameAreaWidth, this.gameAreaHeight, this.foodBlockPosition);
    this.startGame();
  }

  clearSnake() {
    for (let [index, currentBlock] of this.blocksMap) {
      this.gameArea.removeChild(currentBlock);
    }
    this.blocksMap.clear();
  }

  createNewBlock(x, y, id, isHead=false) {
    const newBlock = document.createElement('div');
    newBlock.classList.add('block');
    newBlock.classList.add('snake-block');
    newBlock.style.left = x + 'px';
    newBlock.style.top = y + 'px';
    this.blocksMap.set(id, newBlock);
    if (isHead) {
      if (this.snakeOldHead != null) {
        this.snakeOldHead.classList.remove('transparent');
      }
      newBlock.classList.add('transparent');
      this.snakeOldHead = newBlock;
    }
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
    newFoodBlock.classList.add('block');
    newFoodBlock.classList.add('food-block');
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

  animateSnake(movements, headOnly) {
    const [xTailMovementDir, yTailMovementDir, xHeadMovementDir, yHeadMovementDir] = movements;
    if (xHeadMovementDir === 1) {
      this.snakeMovingHead.classList.add('head-right-movement');
    } else if (xHeadMovementDir === -1) {
      this.snakeMovingHead.classList.add('head-left-movement');
    } else if (yHeadMovementDir === 1) {
      this.snakeMovingHead.classList.add('head-down-movement');
    } else {
      this.snakeMovingHead.classList.add('head-up-movement');
    }
    if (!headOnly) {
      if (xTailMovementDir === 1) {
        this.snakeMovingTail.classList.add('tail-right-movement');
      } else if (xTailMovementDir === -1) {
        this.snakeMovingTail.classList.add('tail-left-movement');
      } else if (yTailMovementDir === 1) {
        this.snakeMovingTail.classList.add('tail-down-movement');
      } else {
        this.snakeMovingTail.classList.add('tail-up-movement');
      }
    }
  }

  nextMove() {
    this.moveSnake(this.snakeBlockSize, 0);
  }

  moveSnake(dx, dy) {
    const gameState = this.snake.move(dx, dy, this.gameAreaWidth, this.gameAreaHeight, this.foodBlockPosition);
    const {foodEaten, gameOver, headId, positions, movements} = gameState;
    const [headPosition, oldTailPosition] = positions;
    const snakeHeadDiv = this.blocksMap.get(headId);
    const [headX, headY] = headPosition;
    if (gameState['gameOver'] === true) {
      this.gameOver = true;
      this.stopGame();
      this.gameOverLayer.style.display = 'block';
    } else if (gameState['foodEaten'] === true) {
      this.createNewBlock(headX, headY, headId, true);
      this.createFoodBlock();
      if (this.autoplay) {
        this.nextMoves = this.snake.nextMoves(this.snakeBlockSize, this.gameAreaWidth, this.gameAreaHeight, this.foodBlockPosition);
      }
      this.setPoints(++this.points);
      // empty moving head's background by removing its class
      this.snakeMovingHead.className = '';
      // move moving head to the new head's position
      this.snakeMovingHeadContainer.style.left = headX + 'px';
      this.snakeMovingHeadContainer.style.top = headY + 'px';
      // trigger animation of head
      this.animateSnake(movements, true);
    } else {
      // move (empty) moving tail to the old tail's position
      this.snakeMovingTailContainer.style.left = oldTailPosition[0] + 'px';
      this.snakeMovingTailContainer.style.top = oldTailPosition[1] + 'px';
      // fill moving tail's background by removing its class so that it falls back to its
      // default style
      this.snakeMovingTail.className = '';
      // without offsetHeight the same animation (i.e. in the same direction)
      // cannot be triggered more than once
      this.snakeMovingTail.offsetHeight;
      if (this.snakeOldHead != null) {
        this.snakeOldHead.classList.remove('transparent');
      }
      snakeHeadDiv.classList.add('transparent');
      this.snakeOldHead = snakeHeadDiv;
      // move snake's last block to the new head position
      snakeHeadDiv.style.left = headX + 'px';
      snakeHeadDiv.style.top = headY + 'px';
      // empty moving head's background by removing its class
      this.snakeMovingHead.className = '';
      this.snakeMovingHead.offsetHeight;
      // move moving head to the new head's position
      this.snakeMovingHeadContainer.style.left = headX + 'px';
      this.snakeMovingHeadContainer.style.top = headY + 'px';
      // trigger animation of both tail and head
      this.animateSnake(movements, false);
    }
  }

  f(event) {
    switch (event.which) {
      // the snake cannot invert its course
      case 37:
        if (this.snake.movementDirection !== 'right') {
          this.snake.movementDirection = 'left';
        }
        break;
      case 38:
        if (this.snake.movementDirection !== 'down') {
          this.snake.movementDirection = 'up';
        }
        break;
      case 39:
        if (this.snake.movementDirection !== 'left') {
          this.snake.movementDirection = 'right';
        }
        break;
      case 40:
        if (this.snake.movementDirection !== 'up') {
          this.snake.movementDirection = 'down';
        }
        break;
    }
  }

}
