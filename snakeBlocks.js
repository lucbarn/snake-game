class Block {
  constructor(value) {
    // value is an array of length 2, which holds the cartesian coordinates of
    // correspondind block of the snake.
    this.value = value;
    this.nextBlock = null;
  }

  getValue() {
    return this.value;
  }

  setNextBlock(nextBlock) {
    this.nextBlock = nextBlock;
  }
}

class Snake {
  // Snake is as a linked list with a pointer to the tail,
  // with each node of the list that holds the value of the position of the
  // corresponding block of the snake. The blocks are in reversed order with
  // respect to the direction of movement of the snake.

  constructor(initialValues) {
    const blocks = initialValues.map(value => new Block(value));
    // head represents the tail of the snake
    this.head = blocks.length === 0 ? null : blocks[0];
    // Join the nodes of the linked list
    for (let i = 1; i < blocks.length; i++) {
      blocks[i-1].setNextBlock(blocks[i]);
    }
    // tail represents the head of the snake
    this.tail = blocks.length === 0 ? null : blocks[blocks.length-1];
    this.blocksSet = new Set();
  }

}
