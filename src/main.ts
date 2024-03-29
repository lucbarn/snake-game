import './style.scss';
import { InitialBlocksPositions, Point } from "./blocks";
import { Game } from './game';

const gameAreaWidth = 900;
const gameAreaHeight = 600;
const snakeBlockSize = 15;
const initialPositions: InitialBlocksPositions = [[0,0], [snakeBlockSize,0], [2*snakeBlockSize,0]];

const game = new Game(gameAreaWidth, gameAreaHeight, snakeBlockSize, initialPositions);

game.init();
game.newGame();
