class Block {
  constructor(position, id) {
    // position is an array of length 2, which stores the cartesian coordinates of
    // the corresponding block of the snake
    this.position = position;
    this.id = id;
    this.nextBlock = null;
  }

  getPosition() {
    return this.position;
  }

  setPosition(position) {
    this.position = position;
  }

  getNextBlock() {
    return this.nextBlock;
  }

  setNextBlock(nextBlock) {
    this.nextBlock = nextBlock;
  }

  getId() {
    return this.id;
  }
}

class MoveBlock {
  constructor(moves, movementDirections) {
    this.moves = moves;
    this.movementDirections = movementDirections;
    this.nextBlock = null;
  }

  getNextBlock() {
    return this.nextBlock;
  }

  setNextBlock(nextBlock) {
    this.nextBlock = nextBlock;
  }

  getMovementDirection() {
    return this.movementDirections[this.movementDirections.length-1];
  }

  getMovementDirections() {
    return this.movementDirections;
  }

  getLastPosition() {
    return this.moves[this.moves.length-1];
  }

  getLastPositions(n) {
    return this.moves.slice(this.moves.length - n);
  }

  getAllPositions() {
    return this.moves;
  }
}

class Snake {
  // Snake is represented as a linked list with a pointer to the tail of the list
  // (the head of the snake), with each node of the list that stores the value of
  // the position of the corresponding block of the snake. The blocks are in
  // reversed order with respect to the direction of movement of the snake

  constructor(initialPositions, movementDirection) {
    if (initialPositions.length == 0) {
      throw 'At least an initial block is needed to create the snake';
    }
    const blocks = initialPositions.map((position, i) => new Block(position, i));
    // the list's head represents the tail of the snake
    this.snakeTail = blocks[0];
    // join the nodes of the linked list
    for (let i = 1; i < blocks.length; i++) {
      blocks[i-1].setNextBlock(blocks[i]);
    }
    // the list's tail represents the head of the snake
    this.snakeHead = blocks[blocks.length-1];
    this.blocksSet = new Set(initialPositions.map(position => position[0] + '_' + position[1]));
    this.lastId = blocks.length-1;
    this.blocksNum = blocks.length;
    this.movementDirection = movementDirection;
  }

  move(dx, dy, gameAreaWidth, foodBlockPosition) {
    let foodBlockEaten = false;
    let gameOver = false;
    const [headX, headY] = this.snakeHead.getPosition();
    const newBlockPosition = [
      (gameAreaWidth + headX + dx) % gameAreaWidth,
      (gameAreaHeight + headY + dy) % gameAreaHeight
    ];
    let newBlock;
    // if the snake eats the food block, a new block is created
    if (newBlockPosition[0] === foodBlockPosition[0]
        && newBlockPosition[1] === foodBlockPosition[1]) {
      newBlock = new Block(newBlockPosition, ++this.lastId);
      this.blocksSet.add(newBlockPosition[0] + '_' + newBlockPosition[1]);
      this.snakeHead.setNextBlock(newBlock);
      this.snakeHead = newBlock;
      foodBlockEaten = true;
      this.blocksNum++;
    // if the snake doesn't eat the food block, the block on the tail is moved
    // to the head
    } else {
      const newSnakeHead = this.snakeTail;
      const oldTailPosition = this.snakeTail.getPosition();
      this.blocksSet.delete(oldTailPosition[0] + '_' + oldTailPosition[1]);
      this.snakeTail = this.snakeTail.getNextBlock();
      this.snakeHead.setNextBlock(newSnakeHead);
      this.snakeHead = newSnakeHead;
      this.snakeHead.setPosition(newBlockPosition);
      this.blocksSet.add(newBlockPosition[0] + '_' + newBlockPosition[1]);
    }
    // If two blocks overlap, the game is over
    if (this.blocksSet.size < this.blocksNum) {
      gameOver = true;
    }
    const gameState = {
      'foodEaten': foodBlockEaten,
      'gameOver': gameOver,
      'headId': this.snakeHead.getId(),
      'headPosition': this.snakeHead.getPosition()
    };
    return gameState;
  }

  hasBlock(block) {
    return this.blocksSet.has(block);
  }

  nextMoves(snakeBlockSize, areaWidth, areaHeight, foodBlockPosition) {
    let moves = [];
    let current = this.snakeTail;
    while (current !== null) {
      moves.push(current.getPosition().join('_'));
      current = current.getNextBlock();
    }
    let head = new MoveBlock(moves, [this.movementDirection]);
    let tail = head;
    let firstMove;
    let secondMove;
    let thirdMove;
    let x;
    let y;
    let newPos;
    let newDir;
    const visited = new Set([head.getLastPosition()]);
    while (true) {
      [x,y] = head.getLastPosition().split('_').map(n => parseInt(n));
      if (head.getMovementDirection() === 'up') {
        firstMove = {
          p: [x, (y - snakeBlockSize + areaHeight) % areaHeight].join('_'),
          dir: 'up'
        };
        secondMove = {
          p: [(x - snakeBlockSize + areaWidth) % areaWidth, y].join('_'),
          dir: 'left'
        };
        thirdMove = {
          p: [(x + snakeBlockSize + areaWidth) % areaWidth, y].join('_'),
          dir: 'right'
        };
      } else if (head.getMovementDirection() === 'right') {
        firstMove = {
          p: [(x + snakeBlockSize + areaWidth) % areaWidth, y].join('_'),
          dir: 'right'
        };
        secondMove = {
          p: [x, (y - snakeBlockSize + areaHeight) % areaHeight].join('_'),
          dir: 'up'
        };
        thirdMove = {
          p: [x, (y + snakeBlockSize + areaHeight) % areaHeight].join('_'),
          dir: 'down'
        };
      } else if (head.getMovementDirection() === 'down') {
        firstMove = {
          p: [x, (y + snakeBlockSize + areaHeight) % areaHeight].join('_'),
          dir: 'down'
        };
        secondMove = {
          p: [(x - snakeBlockSize + areaWidth) % areaWidth, y].join('_'),
          dir: 'left'
        };
        thirdMove = {
          p: [(x + snakeBlockSize + areaWidth) % areaWidth, y].join('_'),
          dir: 'right'
        };
      } else {
        firstMove = {
          p: [(x - snakeBlockSize + areaWidth) % areaWidth, y].join('_'),
          dir: 'left'
        };
        secondMove = {
          p: [x, (y - snakeBlockSize + areaHeight) % areaHeight].join('_'),
          dir: 'up'
        };
        thirdMove = {
          p: [x, (y + snakeBlockSize + areaHeight) % areaHeight].join('_'),
          dir: 'down'
        };
      }
      if (!visited.has(firstMove['p']) && !head.getLastPositions(this.blocksNum).includes(firstMove['p'])) {
        newPos = firstMove['p'];
        newDir = firstMove['dir'];
        if (newPos === foodBlockPosition.join('_')) {
          return head.getMovementDirections().slice(1).concat([newDir]).reverse();
        }
        tail.setNextBlock(new MoveBlock(head.getAllPositions().concat([newPos]), head.getMovementDirections().concat([newDir])));
        tail = tail.getNextBlock();
        visited.add(newPos);
      }
      if (!visited.has(secondMove['p']) && !head.getLastPositions(this.blocksNum).includes(secondMove['p'])) {
        newPos = secondMove['p'];
        newDir = secondMove['dir'];
        if (newPos === foodBlockPosition.join('_')) {
          return head.getMovementDirections().slice(1).concat([newDir]).reverse();
        }
        tail.setNextBlock(new MoveBlock(head.getAllPositions().concat([newPos]), head.getMovementDirections().concat([newDir])));
        tail = tail.getNextBlock();
        visited.add(newPos);
      }
      if (!visited.has(thirdMove['p']) && !head.getLastPositions(this.blocksNum).includes(thirdMove['p'])) {
        newPos = thirdMove['p'];
        newDir = thirdMove['dir'];
        if (newPos === foodBlockPosition.join('_')) {
          return head.getMovementDirections().slice(1).concat([newDir]).reverse();
        }
        tail.setNextBlock(new MoveBlock(head.getAllPositions().concat([newPos]), head.getMovementDirections().concat([newDir])));
        tail = tail.getNextBlock();
        visited.add(newPos);
      }
      if (head.getNextBlock() === null) {
        break;
      } else {
        head = head.getNextBlock();
      }
    }
    return head.getMovementDirections().slice(1).reverse();
  }

}

module.exports = Snake;
