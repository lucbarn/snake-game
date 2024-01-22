import { Point, MovementDirection, SnakeBlock, MoveBlock, pointToString, areSamePoints, InitialBlocksPositions } from "./blocks";

export class Snake {
  // Snake is represented as a linked list with a pointer to the tail of the list
  // (the head of the snake), with each node of the list that stores the value of
  // the position of the corresponding block of the snake. The blocks are in
  // reversed order with respect to the direction of movement of the snake

  snakeHead: SnakeBlock;
  snakeTail: SnakeBlock;
  blocksSet: Set<string>;
  lastId: number;
  blocksNum: number;
  movementDirection: MovementDirection;
  nextMovementDirection: MovementDirection;
  blockSize: number;

  constructor(initialPositions: InitialBlocksPositions, blockSize: number, movementDirection: MovementDirection) {
    if (initialPositions.length == 0) {
      throw 'At least an initial block is needed to create the snake';
    }
    const blocks = initialPositions.map((position, i) => new SnakeBlock(position, i));
    // the list's head represents the tail of the snake
    this.snakeTail = blocks[0];
    // join the nodes of the linked list
    for (let i = 1; i < blocks.length; i++) {
      blocks[i-1].setNextBlock(blocks[i]);
    }
    // the list's tail represents the head of the snake
    this.snakeHead = blocks[blocks.length-1];
    this.blocksSet = new Set(initialPositions.map(position => pointToString(position)));
    this.lastId = blocks.length-1;
    this.blocksNum = blocks.length;
    this.movementDirection = movementDirection;
    this.nextMovementDirection = movementDirection;
    this.blockSize = blockSize;
  }

  move(dx: number, dy: number, gameAreaWidth: number, gameAreaHeight: number, foodBlockPosition: Point) {
    let foodBlockEaten = false;
    let gameOver = false;
    const [headX, headY] = this.snakeHead.getPosition();
    const newHeadPosition: Point = [
      (gameAreaWidth + headX + dx) % gameAreaWidth,
      (gameAreaHeight + headY + dy) % gameAreaHeight
    ];
    const oldTailPosition = this.snakeTail.getPosition();
    let xTailMovementDir = 0;
    let yTailMovementDir = 0;
    let xHeadMovementDir = 0;
    let yHeadMovementDir = 0;
    // if the snake eats the food block, a new block is created
    if (newHeadPosition[0] === foodBlockPosition[0]
        && newHeadPosition[1] === foodBlockPosition[1]) {
      console.log('hit');
      const newHead = new SnakeBlock(newHeadPosition, ++this.lastId);
      this.blocksSet.add(pointToString(newHeadPosition));
      this.snakeHead.setNextBlock(newHead);
      this.snakeHead = newHead;
      foodBlockEaten = true;
      this.blocksNum++;
      console.log('Hit end');
    // if the snake doesn't eat the food block, the block on the tail is moved
    // to the head's position
    } else {
      const newHead = this.snakeTail;
      this.blocksSet.delete(pointToString(oldTailPosition));
      const newTail: SnakeBlock | null = this.snakeTail.getNextBlock();
      if (newTail === null) {
        throw 'Invalid snake blocks';
      }
      this.snakeTail = newTail;
      this.snakeHead.setNextBlock(newHead);
      this.snakeHead = newHead;
      this.snakeHead.setNextBlock(null);
      this.snakeHead.setPosition(newHeadPosition);
      this.blocksSet.add(pointToString(newHeadPosition));
      if (oldTailPosition[0] === this.snakeTail.getPosition()[0]) {
        // compute vertical animation for moving tail
        yTailMovementDir = ((oldTailPosition[1] + this.blockSize) % gameAreaHeight === this.snakeTail.getPosition()[1]) ? 1 : -1;
      } else {
        // compute horizontal animation for moving tail
        xTailMovementDir = ((oldTailPosition[0] + this.blockSize) % gameAreaWidth === this.snakeTail.getPosition()[0]) ? 1 : -1;
      }
    }
    if (dx === 0) {
      // compute vertical animation for moving head
      yHeadMovementDir = (dy > 0) ? 1 : -1;
    } else {
      // compute horizontal animation for moving head
      xHeadMovementDir = (dx > 0) ? 1 : -1;
    }
    // If two blocks overlap, the game is over
    if (this.blocksSet.size < this.blocksNum) {
      gameOver = true;
    }
    const gameState = {
      isFoodEaten: foodBlockEaten,
      isGameOver: gameOver,
      headId: this.snakeHead.getId(),
      positions: [this.snakeHead.getPosition(), oldTailPosition],
      movements: [xTailMovementDir, yTailMovementDir, xHeadMovementDir, yHeadMovementDir]
    };
    return gameState;
  }

  hasBlock(block: Point) {
    return this.blocksSet.has(pointToString(block));
  }

  nextMoves(snakeBlockSize: number, areaWidth: number, areaHeight: number, foodBlockPosition: Point) {
    let moves: Point[] = [];
    let current: SnakeBlock | null = this.snakeTail;
    while (current !== null) {
      moves.push(current.getPosition());
      current = current.getNextBlock();
    }
    console.log('ok 1');
    let head: MoveBlock = new MoveBlock(moves, [this.movementDirection]);
    let tail: MoveBlock = head;
    let firstMove: { p: Point, dir: MovementDirection };
    let secondMove: { p: Point, dir: MovementDirection };
    let thirdMove: { p: Point, dir: MovementDirection };
    const visited: Set<string> = new Set([pointToString(head.getLastPosition())]);
    while (true) {
      const [x,y] = head.getLastPosition();
      if (head.getMovementDirection() === 'up') {
        firstMove = {
          p: [x, (y - snakeBlockSize + areaHeight) % areaHeight],
          dir: 'up'
        };
        secondMove = {
          p: [(x - snakeBlockSize + areaWidth) % areaWidth, y],
          dir: 'left'
        };
        thirdMove = {
          p: [(x + snakeBlockSize + areaWidth) % areaWidth, y],
          dir: 'right'
        };
      } else if (head.getMovementDirection() === 'right') {
        firstMove = {
          p: [(x + snakeBlockSize + areaWidth) % areaWidth, y],
          dir: 'right'
        };
        secondMove = {
          p: [x, (y - snakeBlockSize + areaHeight) % areaHeight],
          dir: 'up'
        };
        thirdMove = {
          p: [x, (y + snakeBlockSize + areaHeight) % areaHeight],
          dir: 'down'
        };
      } else if (head.getMovementDirection() === 'down') {
        firstMove = {
          p: [x, (y + snakeBlockSize + areaHeight) % areaHeight],
          dir: 'down'
        };
        secondMove = {
          p: [(x - snakeBlockSize + areaWidth) % areaWidth, y],
          dir: 'left'
        };
        thirdMove = {
          p: [(x + snakeBlockSize + areaWidth) % areaWidth, y],
          dir: 'right'
        };
      } else {
        firstMove = {
          p: [(x - snakeBlockSize + areaWidth) % areaWidth, y],
          dir: 'left'
        };
        secondMove = {
          p: [x, (y - snakeBlockSize + areaHeight) % areaHeight],
          dir: 'up'
        };
        thirdMove = {
          p: [x, (y + snakeBlockSize + areaHeight) % areaHeight],
          dir: 'down'
        };
      }

      let newPos: Point;
      let newDir: MovementDirection;

      if (!visited.has(pointToString(firstMove['p'])) && !head.contains(firstMove['p'], this.blocksNum)) {
        newPos = firstMove['p'];
        newDir = firstMove['dir'];
        const isFoodBlockFound = areSamePoints(newPos, foodBlockPosition);
        if (isFoodBlockFound) {
          return head.getMovementDirections().slice(1).concat([newDir]).reverse();
        }
        const nextBlock = new MoveBlock(head.getAllPositions().concat([newPos]), head.getMovementDirections().concat([newDir]));
        tail.setNextBlock(nextBlock);
        tail = nextBlock;
        visited.add(pointToString(newPos));
      }
      if (!visited.has(pointToString(secondMove['p'])) && !head.contains(secondMove['p'], this.blocksNum)) {
        newPos = secondMove['p'];
        newDir = secondMove['dir'];
        const isFoodBlockFound = areSamePoints(newPos, foodBlockPosition);
        if (isFoodBlockFound) {
          return head.getMovementDirections().slice(1).concat([newDir]).reverse();
        }
        const nextBlock = new MoveBlock(head.getAllPositions().concat([newPos]), head.getMovementDirections().concat([newDir]));
        tail.setNextBlock(nextBlock);
        tail = nextBlock;
        visited.add(pointToString(newPos));
      }
      if (!visited.has(pointToString(thirdMove['p'])) && !head.contains(thirdMove['p'], this.blocksNum)) {
        newPos = thirdMove['p'];
        newDir = thirdMove['dir'];
        const isFoodBlockFound = areSamePoints(newPos, foodBlockPosition);
        if (isFoodBlockFound) {
          return head.getMovementDirections().slice(1).concat([newDir]).reverse();
        }
        const nextBlock = new MoveBlock(head.getAllPositions().concat([newPos]), head.getMovementDirections().concat([newDir]));
        tail.setNextBlock(nextBlock);
        tail = nextBlock;
        visited.add(pointToString(newPos));
      }

      const headNextBlock: MoveBlock | null = head.getNextBlock();
      if (headNextBlock === null) {
        break;
      } else {
        head = headNextBlock;
      }

    }
    return head.getMovementDirections().slice(1).reverse();
  }

}
