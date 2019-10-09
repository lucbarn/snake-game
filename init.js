const gameAreaWidth = 900;
const gameAreaHeight = 600;
const snakeBlockSize = 15;

const game = new Game(gameAreaWidth, gameAreaHeight, snakeBlockSize);

game.init();
game.newGame();
