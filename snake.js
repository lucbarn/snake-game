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

class Snake {
  // Snake is represented as a linked list with a pointer to the tail of the list
  // (the head of the snake), with each node of the list that stores the value of
  // the position of the corresponding block of the snake. The blocks are in
  // reversed order with respect to the direction of movement of the snake

  constructor(initialPositions) {
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

}
