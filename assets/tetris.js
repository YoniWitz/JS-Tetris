import GameUtil from './GameUtil.js'
import * as Tetromino from './Tetromino.js'
const DEBUG = true;
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const CANVAS_WIDTH = document.getElementById('myCanvas').width;
const GAME_WIDTH = CANVAS_WIDTH * .75;
const CANVAS_HEIGHT = document.getElementById('myCanvas').height;
const PADDING = 5;

//Boxes
const BOXES_COLUMN_COUNT = 10;
const BOXES_ROW_COUNT = BOXES_COLUMN_COUNT * 2;
// const BOXES_SIZE = GAME_WIDTH / BOXES_COLUMN_COUNT;

const NUMBER_OF_TETROMINOS = 7;
const ONE_SECOND = 1000;

let draw = (dynamicGame, staticGame) => {
    //if tetromino hit the bottom
    if (dynamicGame.currentTetromino.lowestRLocation >= BOXES_ROW_COUNT - 1) {
        //when tetromino hits bottom, tetromino is added to backgroundMatrix and magic happens    
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
    ctx.clearRect(PADDING * 2, PADDING * 2, GAME_WIDTH - PADDING * 3, CANVAS_HEIGHT - 3 * PADDING);
    GameUtil.drawBoxes(staticGame.staticMatrix, true);
    GameUtil.addCoordinates(dynamicGame.currentTetromino.tetrominoMatrix);
    GameUtil.drawBoxes(dynamicGame.currentTetromino.tetrominoMatrix, false);
    // requestAnimationFrame(draw);
}

//key listener function
let keyDownHandler = (event, currentTetromino) => {
    var key = event.key;
    switch (key) {
        case 32:
            break;
        case "ArrowRight":
            currentTetromino.moveRight();
            break;
        case "ArrowLeft":
            currentTetromino.moveLeft();
            break;
        case "ArrowUp":
            currentTetromino.rotate();
            break;
        //down arrow
        case 40:
            break;
    }
};

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
            let random = Math.round(Math.random() * (NUMBER_OF_TETROMINOS - 1));
            if(DEBUG){
                random = 6;
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

        addTetrominoToStaticMatrix(tetromino) {
            for (let r = tetromino.lowestRLocation - 3; r < this.staticMatrix.length; r++) {
                for (let c = 0; c < tetromino.tetrominoNumOfColumns; c++)
                    this.staticMatrix[r][c].status |= tetromino.tetrominoMatrix[r][c].status;
            }
        }
    };

    staticGame.createInitialStaticMatrix();
    dynamicGame.setRandomTetromino();

    //key listener
    document.addEventListener("keydown", function (event) { keyDownHandler(event, dynamicGame.currentTetromino); }, false);

    setInterval(function () { draw(dynamicGame, staticGame); }, ONE_SECOND);
}

