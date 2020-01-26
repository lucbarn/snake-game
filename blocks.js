class Block {
  constructor() {
    this.nextBlock = null;
  }

  getNextBlock() {
    return this.nextBlock;
  }

  setNextBlock(nextBlock) {
    this.nextBlock = nextBlock;
  }
}

class SnakeBlock extends Block {
  constructor(position, id) {
    super();
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

  getId() {
    return this.id;
  }
}

class MoveBlock extends Block {
  constructor(moves, movementDirections) {
    super();
    this.moves = moves;
    this.movementDirections = movementDirections;
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
