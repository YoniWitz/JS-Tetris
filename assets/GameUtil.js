let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
const CANVAS_WIDTH = document.getElementById('myCanvas').width;
const GAME_WIDTH = CANVAS_WIDTH * .75;

//Boxes
const BOXES_COLUMN_COUNT = 10;

const BOXES_ROW_COUNT = BOXES_COLUMN_COUNT * 2;
const BOXES_SIZE = GAME_WIDTH / BOXES_COLUMN_COUNT;
const BOXES_PADDING = 2;
const BOXES_BORDER_WIDTH = BOXES_SIZE - 2 * BOXES_PADDING;
const BOXES_BORDER_HEIGHT = BOXES_BORDER_WIDTH;
const INNER_TO_OUTER_RATIO = 3.5;
const BOXES_INNER_BOX_WIDTH = BOXES_SIZE - INNER_TO_OUTER_RATIO * 2 * BOXES_PADDING;
const BOXES_INNER_BOX_HEIGHT = BOXES_INNER_BOX_WIDTH;
const PADDING = 5;

export default class GameUtil {
    static endOfGame = false;
    static score = 0;

    static drawScore() {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + this.score, canvas.width - 85, 20);
    }
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
        //if tetromino  pressed against left wall
        if (currentTetromino.farLeftCLocation <= 0) {
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

    static detectEndOfGame(currentTetromino, staticMatrix) {
        for (let c = currentTetromino.farLeftCLocation; c <= currentTetromino.farRightCLocation; c++) {
            if (staticMatrix[3][c].status === 1 && currentTetromino.tetrominoMatrix[2][c].status === 1) {
                this.endOfGame = true;
            }
        }
    }
    static detectBottomCollision(currentTetromino, staticMatrix) {
        //if tetromino not on bottom row
        if (currentTetromino.lowestRLocation < BOXES_ROW_COUNT - 1) {
            //check bottom 3 rows of tetromino if collides with static matrix
            for (let r = currentTetromino.lowestRLocation - 2; r <= currentTetromino.lowestRLocation; r++) {
                if (r < 0) continue;
                for (let c = currentTetromino.farLeftCLocation; c <= currentTetromino.farRightCLocation; c++) {
                    if (currentTetromino.tetrominoMatrix[r][c].status === 1 && staticMatrix[r + 1][c].status === 1)
                        return true;
                }
            }
        }
        return false;
    }
    //key listener function
    static keyDownHandler = (event, dynamicGame, staticMatrix) => {
        var key = event.key;
        let tetrominosCollision;
        switch (key) {
            //spacebar           
            case "Spacebar":
            case " ":
                tetrominosCollision = this.detectBottomCollision(dynamicGame.currentTetromino, staticMatrix);
                while (!tetrominosCollision && dynamicGame.currentTetromino.lowestRLocation < BOXES_ROW_COUNT - 1) {
                    //add new row to top of tetromino
                    dynamicGame.addNewRowToCurrentTetromino();
                    dynamicGame.currentTetromino.lowestRLocation++;
                    tetrominosCollision = this.detectBottomCollision(dynamicGame.currentTetromino, staticMatrix);
                }
                break;
            case "ArrowRight":
                this.moveRight(dynamicGame.currentTetromino, staticMatrix);
                break;
            case "ArrowLeft":
                this.moveLeft(dynamicGame.currentTetromino, staticMatrix);
                break;
            case "ArrowUp":
                let tetrominoType = dynamicGame.currentTetromino.constructor.name;
                let rotationState = dynamicGame.currentTetromino.rotationState;
                let lowestRLocation = dynamicGame.currentTetromino.lowestRLocation;
                let rotationCLocation = dynamicGame.currentTetromino.rotationCLocation;
                let rotatePermittedFlag = true;
                if (tetrominoType === "JTetromino") {
                    if (rotationState === 0) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation - 2][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation - 1][rotationCLocation].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 1) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation - 1][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation + 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 2) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 3) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation + 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                }
                else if (tetrominoType === "LTetromino") {
                    if (rotationState === 0) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation - 2][rotationCLocation].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 1) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation - 1][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 2) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation - 2][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 3) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation + 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                }
                else if (tetrominoType === "TTetromino") {
                    if (rotationState === 0) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation - 2][rotationCLocation].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 1) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 2) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 3) {
                        if (staticMatrix[lowestRLocation][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation + 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                }
                else if (tetrominoType === "ITetromino") {
                    if (rotationState === 0) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation + 1][rotationCLocation].status === 1
                            || staticMatrix[lowestRLocation + 2][rotationCLocation].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 1) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation - 2].status === 1
                            || staticMatrix[lowestRLocation - 2][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation - 2][rotationCLocation + 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                }
                else if (tetrominoType === "STetromino") {
                    if (rotationState === 0) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation - 1][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 1) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                }
                else if (tetrominoType === "ZTetromino") {
                    if (rotationState === 0) {
                        if (staticMatrix[lowestRLocation - 2][rotationCLocation - 1].status === 1
                            || staticMatrix[lowestRLocation - 1][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                    if (rotationState === 1) {
                        if (staticMatrix[lowestRLocation - 1][rotationCLocation + 1].status === 1
                            || staticMatrix[lowestRLocation][rotationCLocation - 1].status === 1) {
                            rotatePermittedFlag = false
                        }
                    }
                }
                if (rotatePermittedFlag)
                    dynamicGame.currentTetromino.rotate();
                break;
            //down arrow
            case "ArrowDown":
                tetrominosCollision = this.detectBottomCollision(dynamicGame.currentTetromino, staticMatrix);
                //if no tetromino underneath and not on bottom row
                if (!tetrominosCollision && dynamicGame.currentTetromino.lowestRLocation < BOXES_ROW_COUNT - 1) {
                    //add new row to top of tetromino
                    dynamicGame.addNewRowToCurrentTetromino();
                    dynamicGame.currentTetromino.lowestRLocation++;
                }
                break;
        }
    }
    static drawBoxes = (matrix, isBackground) => {
        let color;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c].status === 0) {
                    color = "red"
                }
                else {
                    color = "yellow"
                }

                if (isBackground || color === "yellow") {
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
                let outerBoxY = BOXES_PADDING * (1 + 2 * r) + (r * BOXES_BORDER_HEIGHT);

                let innerBoxX = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * c) + (c * BOXES_INNER_BOX_WIDTH);
                let innerBoxY = INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * r) + (r * BOXES_INNER_BOX_HEIGHT);

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