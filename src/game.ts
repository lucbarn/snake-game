import { Point, MovementDirection, SnakeBlock, MoveBlock, pointToString, areSamePoints, InitialBlocksPositions } from "./blocks";
import { Snake } from './snake';

export class Game {
  gameAreaWidth: number;
  gameAreaHeight: number;
  snakeBlockSize: number;
  gameArea: HTMLElement;
  startButton: HTMLElement;
  stopButton: HTMLElement;
  autoplayButton: HTMLElement;
  newGameButton: HTMLElement;
  pointsValue: HTMLElement;
  gameOverLayer: HTMLElement;
  snakeMovingTail: HTMLElement;
  snakeMovingTailContainer: HTMLElement;
  snakeMovingHead: HTMLElement;
  snakeMovingHeadContainer: HTMLElement;
  normalModeButton: HTMLElement;
  autoModeButton: HTMLElement;
  initialPositions: InitialBlocksPositions;
  blocksMap: Map<number, HTMLElement>;
  gameStarted: boolean;
  gameOver: boolean;
  autoplay: boolean;
  nextMoves: MovementDirection[];
  points: number;
  foodBlock: HTMLElement;
  foodBlockPosition: Point;
  snake: Snake;
  snakeMovement: ReturnType<typeof setTimeout>;
  snakeOldHead: HTMLElement;

  constructor(gameAreaWidth: number, gameAreaHeight: number, snakeBlockSize: number, initialPositions: InitialBlocksPositions) {
    this.gameAreaWidth = gameAreaWidth;
    this.gameAreaHeight = gameAreaHeight;
    this.snakeBlockSize = snakeBlockSize;
    this.initialPositions = initialPositions;
    this.init();
  }

  initHTMLElements() {
    this.gameArea = this.getHtmlElementOrFail('game-area');
    this.startButton = this.getHtmlElementOrFail('start-button');
    this.stopButton = this.getHtmlElementOrFail('stop-button');
    this.newGameButton = this.getHtmlElementOrFail('new-game-button');
    this.pointsValue = this.getHtmlElementOrFail('points-value');
    this.gameOverLayer = this.getHtmlElementOrFail('game-over-layer');
    this.snakeMovingTail = this.getHtmlElementOrFail('moving-tail');
    this.snakeMovingTailContainer = this.getHtmlElementOrFail('moving-tail-container');
    this.snakeMovingHead = this.getHtmlElementOrFail('moving-head');
    this.snakeMovingHeadContainer = this.getHtmlElementOrFail('moving-head-container');
    this.normalModeButton = this.getHtmlElementOrFail('normal-mode-button');
    this.autoModeButton = this.getHtmlElementOrFail('auto-mode-button');
  }

  getHtmlElementOrFail(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (element === null) {
      throw 'Could not find element with id ' + id + '.';
    }
    return element;
  }

  init() {
    this.initHTMLElements();
    this.startButton.addEventListener('click', this.startGame.bind(this));
    this.stopButton.addEventListener('click', this.stopGame.bind(this));
    this.newGameButton.addEventListener('click', this.newGame.bind(this));
    this.normalModeButton.addEventListener('click', this.setNormalMode.bind(this));
    this.autoModeButton.addEventListener('click', this.setAutoMode.bind(this));
    this.blocksMap = new Map();
    this.nextMoves = [];
  }

  setNormalMode() {
    this.autoplay = false;
    window.addEventListener('keydown', this.getDirection.bind(this));
    this.autoModeButton.classList.remove('blue-button');
    this.normalModeButton.classList.add('blue-button');
  }

  setAutoMode() {
    this.autoplay = true;
    this.nextMoves = this.snake.nextMoves(this.snakeBlockSize, this.gameAreaWidth, this.gameAreaHeight, this.foodBlockPosition);
    window.removeEventListener('keydown', this.getDirection.bind(this));
    this.normalModeButton.classList.remove('blue-button');
    this.autoModeButton.classList.add('blue-button');
  }

  newGame() {
    this.gameStarted = false;
    this.gameOver = false;
    this.setPoints(0);
    this.clearSnake();
    this.initialPositions.forEach((coordinates, i) => this.createNewBlock(...coordinates, i));
    this.snake = new Snake(this.initialPositions, this.snakeBlockSize, 'right');
    this.snakeMovingTailContainer.style.left = this.initialPositions[0][0] + 'px';
    this.snakeMovingTailContainer.style.top = this.initialPositions[0][1] + 'px';
    this.snakeMovingHeadContainer.style.left = this.initialPositions[this.initialPositions.length-1][0] + 'px';
    this.snakeMovingHeadContainer.style.top = this.initialPositions[this.initialPositions.length-1][1] + 'px';
    this.createFoodBlock();
    this.setNormalMode();
    this.gameOverLayer.style.display = 'none';
  }

  startGame() {
    if (!(this.gameOver || this.gameStarted)) {
      this.gameStarted = true;
      this.snakeMovement = setInterval(() => {
        if (this.autoplay && this.nextMoves.length > 0) {
          const nextMove = this.nextMoves.pop();
          if (nextMove != undefined) {
            this.snake.nextMovementDirection = nextMove;
          }
        }
        switch (this.snake.nextMovementDirection) {
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

  createNewBlock(x: number, y: number, id: number, isHead=false) {
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

  getNewFoodPosition(): Point | null {
    let x = Math.floor(Math.random() * this.gameAreaWidth / this.snakeBlockSize) * this.snakeBlockSize;
    let y = Math.floor(Math.random() * this.gameAreaHeight / this.snakeBlockSize) * this.snakeBlockSize;
    // check that the food block position doesn't overlap with the position of one of the snake's blocks;
    // if it does, find the first available position
    if (this.snake.hasBlock([x,y])) {
      for (let dx = 0; dx < this.gameAreaWidth; dx += this.snakeBlockSize) {
        for (let dy = 0; dy < this.gameAreaHeight; dy += this.snakeBlockSize) {
          const x2 = (x + dx) % this.gameAreaWidth;
          const y2 = (y + dy) % this.gameAreaHeight;
          if (!this.snake.hasBlock([x2,y2])) {
            return [x2,y2];
          }
        }
      }
      return null;
    } else {
      return [x,y];
    }
  }

  createFoodBlock() {
    const optionalNewFoodPosition = this.getNewFoodPosition();
    if (optionalNewFoodPosition == null) {
      this.setGameOver();
      return;
    }
    const [x,y] = optionalNewFoodPosition;
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

  setPoints(n: number) {
    this.points = n;
    this.pointsValue.innerText = `${this.points}`;
  }

  animateSnake(movements: number[], headOnly: boolean) {
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

  setGameOver() {
    this.gameOver = true;
    this.stopGame();
    this.gameOverLayer.style.display = 'block';
  }

  nextMove() {
    this.moveSnake(this.snakeBlockSize, 0);
  }

  moveSnake(dx: number, dy: number) {
    const gameState = this.snake.move(dx, dy, this.gameAreaWidth, this.gameAreaHeight, this.foodBlockPosition);
    const {isFoodEaten, isGameOver, headId, positions, movements} = gameState;
    const [headPosition, oldTailPosition] = positions;
    const [headX, headY] = headPosition;
    if (isGameOver) {
      this.setGameOver();
    } else if (isFoodEaten) {
      console.log('Food eaten');
      this.createNewBlock(headX, headY, headId, true);
      console.log('Block created');
      this.createFoodBlock();
      console.log('Food block created');
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
      const snakeHeadDiv = this.blocksMap.get(headId);
      if (snakeHeadDiv == undefined) {
        throw 'Invalid state';
      }
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
      // update snakes's movement direction
      this.snake.movementDirection = this.snake.nextMovementDirection;
    }
  }

  getDirection(event: KeyboardEvent) {
    switch (event.which) {
      // the snake cannot invert its course
      case 37:
        if (this.snake.movementDirection !== 'right') {
          this.snake.nextMovementDirection = 'left';
        }
        break;
      case 38:
        if (this.snake.movementDirection !== 'down') {
          this.snake.nextMovementDirection = 'up';
        }
        break;
      case 39:
        if (this.snake.movementDirection !== 'left') {
          this.snake.nextMovementDirection = 'right';
        }
        break;
      case 40:
        if (this.snake.movementDirection !== 'up') {
          this.snake.nextMovementDirection = 'down';
        }
        break;
    }
  }

}
