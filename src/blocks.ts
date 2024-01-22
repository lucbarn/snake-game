// stores the cartesian coordinates of the corresponding point
export type Point = [number, number];
export type MovementDirection = 'left' | 'up' | 'right' | 'down';
export type InitialBlocksPositions = [ Point, Point, Point, ...Point[] ];

export function pointToString(point: Point) {
  const res = point
    .map(n => n.toString())
    .join('_'); 
  return res;
}

export function areSamePoints(point1: Point, point2: Point) {
  const [x1,y1] = point1;
  const [x2,y2] = point2;
  return x1 === x2 && y1 === y2;
}

class Block {
  nextBlock: this | null;
  
  constructor() {
    this.nextBlock = null;
  }

  getNextBlock(): this | null {
    return this.nextBlock;
  }

  setNextBlock(nextBlock: this | null) {
    this.nextBlock = nextBlock;
  }
}

export class SnakeBlock extends Block {
  id: number;
  position: Point;

  constructor(position: Point, id: number) {
    super();
    this.id = id;
    this.nextBlock = null;
    this.position = [...position];
  }

  getPosition(): Point {
    return this.position;
  }

  setPosition(position: Point) {
    this.position = position;
  }

  getId(): number {
    return this.id;
  }
}

export class MoveBlock extends Block {
  moves: Point[];
  movementDirections: MovementDirection[];
  
  constructor(moves: Point[], movementDirections: MovementDirection[]) {
    super();
    this.moves = [...moves];
    this.movementDirections = [...movementDirections];
  }

  getMovementDirection(): MovementDirection {
    return this.movementDirections[this.movementDirections.length-1];
  }

  getMovementDirections(): MovementDirection[] {
    return this.movementDirections;
  }

  getLastPosition(): Point {
    return this.moves[this.moves.length-1];
  }

  getLastPositions(n: number): Point[] {
    return this.moves.slice(this.moves.length - n);
  }

  getAllPositions(): Point[] {
    return this.moves;
  }

  contains(p: Point, n=0): boolean {
    const res = this
      .getLastPositions(n)
      .map(point => pointToString(point))
      .includes(pointToString(p));
    return res;
  }
}
