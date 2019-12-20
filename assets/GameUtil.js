import * as Tetromino from './Tetromino.js'
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
const CANVAS_WIDTH = document.getElementById('myCanvas').width;
const GAME_WIDTH = CANVAS_WIDTH * .75;

//Boxes
const BOXES_COLUMN_COUNT = 10;
const BOXES_SIZE = GAME_WIDTH / BOXES_COLUMN_COUNT;
const BOXES_PADDING = 2;
const BOXES_BORDER_WIDTH = BOXES_SIZE - 2 * BOXES_PADDING;
const BOXES_BORDER_HEIGHT = BOXES_BORDER_WIDTH;
const INNER_TO_OUTER_RATIO = 3.5;
const BOXES_INNER_BOX_WIDTH = BOXES_SIZE - INNER_TO_OUTER_RATIO * 2 * BOXES_PADDING;
const BOXES_INNER_BOX_HEIGHT = BOXES_INNER_BOX_WIDTH;
const PADDING = 5;


export default class GameUtil {
    static moveRight(currentTetromino, staticMatrix) {
        //if tetromino  pressed against right wall
        if (currentTetromino.farRightCLocation >= (currentTetromino.tetrominoNumOfColumns - 1)) {
            return;
        }
        //tetromino exists where user wants to move
        if (
            (currentTetromino.tetrominoMatrix[currentTetromino.lowestRLocation][currentTetromino.farRightCLocation].status === 1
                && staticMatrix[currentTetromino.lowestRLocation][currentTetromino.farRightCLocation + 1].status === 1)
            ||
            (currentTetromino.tetrominoMatrix[currentTetromino.lowestRLocation - 1][currentTetromino.farRightCLocation].status === 1
                && staticMatrix[currentTetromino.lowestRLocation - 1][currentTetromino.farRightCLocation + 1].status === 1)
            ||
            (currentTetromino.tetrominoMatrix[currentTetromino.lowestRLocation - 2][currentTetromino.farRightCLocation].status === 1
                && staticMatrix[currentTetromino.lowestRLocation - 2][currentTetromino.farRightCLocation + 1].status === 1)
        ) {
            return;
        }
        currentTetromino.moveRight();
    }

    static moveLeft(currentTetromino, staticMatrix) {
        //if tetromino  pressed against right wall
        if (currentTetromino.farLeftCLocation<= 0) {
            return;
        }
        //tetromino exists where user wants to move
        if (
            (currentTetromino.tetrominoMatrix[currentTetromino.lowestRLocation][currentTetromino.farLeftCLocation].status === 1
                && staticMatrix[currentTetromino.lowestRLocation][currentTetromino.farLeftCLocation - 1].status === 1)
            ||
            (currentTetromino.tetrominoMatrix[currentTetromino.lowestRLocation - 1][currentTetromino.farLeftCLocation].status === 1
                && staticMatrix[currentTetromino.lowestRLocation - 1][currentTetromino.farLeftCLocation - 1].status === 1)
            ||
            (currentTetromino.tetrominoMatrix[currentTetromino.lowestRLocation - 2][currentTetromino.farLeftCLocation].status === 1
                && staticMatrix[currentTetromino.lowestRLocation - 2][currentTetromino.farLeftCLocation - 1].status === 1)
        ) {
            return;
        }
        currentTetromino.moveLeft();
    }

    //key listener function
    static keyDownHandler = (event, currentTetromino, staticMatrix) => {
        var key = event.key;
        switch (key) {
            case 32:
                break;
            case "ArrowRight":
                this.moveRight(currentTetromino, staticMatrix);
                break;
            case "ArrowLeft":
                this.moveLeft(currentTetromino, staticMatrix);
                break;
            case "ArrowUp":
                currentTetromino.rotate();
                break;
            //down arrow
            case 40:
                break;
        }
    }
    static drawBoxes = (matrix, isBackground) => {
        let color;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c].status === 0) {
                    color = "gray"
                }
                else {
                    color = "black"
                }

                if (isBackground || color === "black") {
                    ctx.beginPath();
                    //outer box
                    ctx.strokeRect(matrix[r][c].outerX, matrix[r][c].outerY, BOXES_BORDER_WIDTH, BOXES_BORDER_HEIGHT);
                    //inner box
                    ctx.rect(matrix[r][c].innerX, matrix[r][c].innerY, BOXES_INNER_BOX_WIDTH, BOXES_INNER_BOX_HEIGHT);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    static addCoordinates = (matrix) => {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                let outerBoxX = PADDING * 2 + BOXES_PADDING * (1 + 2 * c) + (c * BOXES_BORDER_WIDTH);
                let outerBoxY = PADDING * 2 + BOXES_PADDING * (1 + 2 * r) + (r * BOXES_BORDER_HEIGHT);

                let innerBoxX = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * c) + (c * BOXES_INNER_BOX_WIDTH);
                let innerBoxY = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * r) + (r * BOXES_INNER_BOX_HEIGHT);

                matrix[r][c].outerX = outerBoxX;
                matrix[r][c].outerY = outerBoxY;

                matrix[r][c].innerX = innerBoxX;
                matrix[r][c].innerY = innerBoxY;
            }
        }
    }
    //static board stuff
    static drawBorderLines = () => {
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(PADDING, PADDING, GAME_WIDTH - PADDING * 2, CANVAS_HEIGHT - PADDING * 2);//for white background
    }
}