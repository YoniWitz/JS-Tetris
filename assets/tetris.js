import GameUtil from './game-util.js'
import GameBanner from './game-banner.js'
import GameBoard from './game-board.js';
import DynamicGame from './dynamic-game.js'
import StaticGame from './static-game.js';

//Boxes
const BOXES_COLUMN_LENGTH = 10;
const BOXES_ROW_LENGTH = BOXES_COLUMN_LENGTH * 2;

const ONE_SECOND = 500;
let myPlay;

let DEBUG = false;

let play = (dynamicGame, staticGame) => {
    const gameBoard = new GameBoard(document.getElementById('myCanvas'));
    //if this is first iteration, set current tetromino
    if (dynamicGame.currentTetromino === null) {
        dynamicGame.setRandomTetromino();
    }
    else {
        GameUtil.detectEndOfGame(dynamicGame.currentTetromino, staticGame.staticMatrix)
        if (GameUtil.endOfGame) {
            clearInterval(myPlay);
            alert('game over, you lose. Press okay to start over');
            window.location.reload();
        }
        //detect collision with another tetromino
        let tetrominosCollision = GameUtil.detectBottomCollision(dynamicGame.currentTetromino, staticGame.staticMatrix);
        //if tetromino hit the bottom or collids with another tetromino
        if (dynamicGame.currentTetromino.lowestRLocation >= BOXES_ROW_LENGTH - 1 || tetrominosCollision) {
            staticGame.addTetrominoToStaticMatrix(dynamicGame.currentTetromino, gameBoard);
            dynamicGame.setRandomTetromino();
        }
        else {
            //if no key was pressed
            if (!dynamicGame.currentTetromino.keydownFlag) {
                //add new row to top of tetromino
                dynamicGame.addNewRowToCurrentTetromino();
                dynamicGame.currentTetromino.lowestRLocation++;
            }
            else {
                dynamicGame.currentTetromino.keydownFlag = false;
            }
        }
    }
    
    gameBoard.clearBoard();
    gameBoard.drawScore(GameUtil.score);

    gameBoard.drawBoxes(staticGame.staticMatrix, true);
    GameUtil.addCoordinates(dynamicGame.currentTetromino.tetrominoMatrix);
    gameBoard.drawBoxes(dynamicGame.currentTetromino.tetrominoMatrix, false);
}

window.onload = () => {
    let dynamicGame = new DynamicGame(DEBUG);

    let staticGame =new StaticGame(GameUtil);

    staticGame.createInitialStaticMatrix();

    //key listener
    document.addEventListener("keydown", function (event) { GameUtil.keyDownHandler(event, dynamicGame, staticGame.staticMatrix); }, false);
    const gameBanner = new GameBanner(document.getElementById('gameBanner'));
    gameBanner.draw()
    myPlay = setInterval(function () { play(dynamicGame, staticGame); }, ONE_SECOND);
}


