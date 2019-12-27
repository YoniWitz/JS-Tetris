import GameUtil from './GameUtil.js'
import * as Tetromino from './Tetromino.js'
const DEBUG = false;
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
//banner area
let banner = document.getElementById('gameBanner');
let bannerContext = banner.getContext('2d');

const CANVAS_WIDTH = document.getElementById('myCanvas').width;
const GAME_WIDTH = CANVAS_WIDTH * .75;
const CANVAS_HEIGHT = document.getElementById('myCanvas').height;
const PADDING = 5;

//Boxes
const BOXES_COLUMN_COUNT = 10;
const BOXES_ROW_COUNT = BOXES_COLUMN_COUNT * 2;
// const BOXES_SIZE = GAME_WIDTH / BOXES_COLUMN_COUNT;

const NUMBER_OF_TETROMINOS = 7;
const ONE_SECOND = 500;
let myPlay;

let play = (dynamicGame, staticGame) => {

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
        if (dynamicGame.currentTetromino.lowestRLocation >= BOXES_ROW_COUNT - 1 || tetrominosCollision) {
            staticGame.addTetrominoToStaticMatrix(dynamicGame.currentTetromino);
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
    ctx.clearRect(PADDING * 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 3 * PADDING);
    GameUtil.drawScore();
    GameUtil.drawBoxes(staticGame.staticMatrix, true);
    GameUtil.addCoordinates(dynamicGame.currentTetromino.tetrominoMatrix);
    GameUtil.drawBoxes(dynamicGame.currentTetromino.tetrominoMatrix, false);
    // requestAnimationFrame(draw);
}

//drawBorderLines();
window.onload = () => {
    let dynamicGame = {
        currentTetromino: null,

        newRow: function () {
            let newRow = [];
            for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                newRow[c] = { status: 0 };
            }
            return newRow;
        },

        setRandomTetromino: function () {
            let random = Math.round(Math.random() * (NUMBER_OF_TETROMINOS) - 0.5);
            if (DEBUG) {
                random = 1;
            }

            if (random === 0)
                this.currentTetromino = new Tetromino.ITetromino();
            if (random === 1)
                this.currentTetromino = new Tetromino.JTetromino();
            if (random === 2)
                this.currentTetromino = new Tetromino.LTetromino();
            if (random === 3)
                this.currentTetromino = new Tetromino.OTetromino();
            if (random === 4)
                this.currentTetromino = new Tetromino.STetromino();
            if (random === 5)
                this.currentTetromino = new Tetromino.TTetromino();
            if (random === 6)
                this.currentTetromino = new Tetromino.ZTetromino();
        },

        addNewRowToCurrentTetromino: function () {
            if (this.currentTetromino) {
                this.currentTetromino.tetrominoMatrix.unshift(this.newRow())
            }
        }
    }

    let staticGame = {
        staticMatrix: [],

        createInitialStaticMatrix: function () {
            for (let r = 0; r < BOXES_ROW_COUNT; r++) {
                this.staticMatrix[r] = [];
                for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                    this.staticMatrix[r][c] = { status: 0 };
                }
            }
            GameUtil.addCoordinates(this.staticMatrix);
        },

        newRow: function () {
            let newRow = [];
            for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                newRow[c] = { status: 0 };
            }
            return newRow;
        },

        addTetrominoToStaticMatrix(tetromino) {
            for (let r = tetromino.lowestRLocation - 3; r <= tetromino.lowestRLocation; r++) {
                if (r < 0 || r >= BOXES_ROW_COUNT) {
                    return;
                }
                let count = 0;
                for (let c = 0; c < tetromino.tetrominoNumOfColumns; c++) {
                    this.staticMatrix[r][c].status |= tetromino.tetrominoMatrix[r][c].status;
                    if (this.staticMatrix[r][c].status === 1)
                        count++;
                }
                //if row is full
                if (count >= 10) {
                    GameUtil.score += 100;
                    this.staticMatrix.splice(r, 1);
                    this.addNewRowToStaticMatrix();
                    GameUtil.addCoordinates(this.staticMatrix);
                    ctx.clearRect(PADDING * 2, PADDING * 2, GAME_WIDTH - PADDING * 3, CANVAS_HEIGHT - 3 * PADDING);
                    GameUtil.drawBoxes(staticGame.staticMatrix, true);
                }
            }
        },
        addNewRowToStaticMatrix: function () {
            if (this.staticMatrix) {
                this.staticMatrix.unshift(this.newRow())
            }
        }
    };

    staticGame.createInitialStaticMatrix();

    //key listener
    document.addEventListener("keydown", function (event) { GameUtil.keyDownHandler(event, dynamicGame, staticGame.staticMatrix); }, false);
    drawBanner();
    myPlay = setInterval(function () { play(dynamicGame, staticGame); }, ONE_SECOND);
}

let drawBanner = () => {
    bannerContext.fillStyle = 'white';
    bannerContext.fillRect(0, 0, banner.width, banner.height);
    bannerContext.font = "30px Arial";
    bannerContext.fillStyle = 'black';
    bannerContext.fillText("My Tetris Game", 50, 30);
    bannerContext.font = "20px Arial";
   
    bannerContext.fillText("Instructions: ", 50, 60);
    bannerContext.fillText("1. Use right and left keyboard arrows to navigate.", 50, 90);
    bannerContext.fillText("2. Press up arrow to rotate tetromino", 50, 120);
    bannerContext.fillText("3. Press down arrow to jump one line", 50, 150);
    bannerContext.fillText("4. Press spacebar to drop the tetromino to the bottom", 50, 180);
    bannerContext.fillText("Earn 100 points for every filled line", 50, 250);
}

