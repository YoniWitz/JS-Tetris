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
const BOXES_SIZE = GAME_WIDTH / BOXES_COLUMN_COUNT;

const BOXES_PADDING = 2;
const BOXES_BORDER_WIDTH = BOXES_BORDER_HEIGHT = BOXES_SIZE - 2 * BOXES_PADDING;
const INNER_TO_OUTER_RATIO = 3.5;
const BOXES_INNER_BOX_WIDTH = BOXES_INNER_BOX_HEIGHT = BOXES_SIZE - INNER_TO_OUTER_RATIO * 2 * BOXES_PADDING;

const NUMBER_OF_TETROMINOS = 7;
const ONE_SECOND = 1000;

//static board stuff
drawBorderLines = () => {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(PADDING, PADDING, GAME_WIDTH - PADDING * 2, CANVAS_HEIGHT - PADDING * 2);//for white background
}

draw = (background) => {
    if (typeof background.currentTetromino.lowestRLocation === 'undefined' || background.currentTetromino.lowestRLocation >= BOXES_ROW_COUNT - 1) {
        let rand;

        //when tetromino hits bottom, tetromino is added to backgroundMatrix and magic happens
        //TO-DO
        if (background.currentTetromino.lowestRLocation >= BOXES_ROW_COUNT - 1) {
            for (let r = background.currentTetromino.lowestRLocation - 3; r < background.backgroundMatrix.length; r++) {
                for (let c = 0; c < background.currentTetromino.tetrominoLength; c++)
                    background.backgroundMatrix[r][c].status |= background.currentTetromino.tetrominoMatrix[r][c].status;
            }
        }
        ctx.clearRect(PADDING * 2, PADDING * 2, GAME_WIDTH - PADDING * 3, CANVAS_HEIGHT - 3 * PADDING);
        background.drawBoxes(background.backgroundMatrix);

        rand = Math.round(Math.random() * (NUMBER_OF_TETROMINOS - 1));
        if (DEBUG) {
            rand = 0;
        }
        background.currentTetromino = background.getRandomTetromino(rand);
    }
    else {
        //if no key was pressed
        if (!background.currentTetromino.keydownFlag) {
            //add new row to 
            background.currentTetromino.tetrominoMatrix.unshift(JSON.parse(JSON.stringify(background.newRow)));

            background.currentTetromino.lowestRLocation++;

        }
        else {
            background.currentTetromino.keydownFlag = false;
        }
        background.addCoordinates(background.currentTetromino.tetrominoMatrix);
        background.drawBoxes(background.currentTetromino.tetrominoMatrix);
    }


    // requestAnimationFrame(draw);
}

//key listener function
keyDownHandler = (event, currentTetromino) => {
    var key = event.key;
    switch (key) {
        case 32:
            break;
        case "ArrowRight":
            currentTetromino.moveRight();
            break;
        case "ArrowLeft":
            sidewaysFlag = true;
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
    let background = {
        backgroundMatrix: [],
        newRow: [],
        timeForNewTetrominoFlag: true,
        randomTetrominoData: [],
        currentTetromino: {},

        getRandomTetromino: function (random) {

            let iOnes = [{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 }];
            let jOnes = [{ r: 1, c: 3 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
            let lOnes = [{ r: 1, c: 5 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
            let oOnes = [{ r: 1, c: 4 }, { r: 1, c: 5 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
            let sOnes = [{ r: 1, c: 4 }, { r: 1, c: 5 }, { r: 2, c: 3 }, { r: 2, c: 4 }];
            let tOnes = [{ r: 1, c: 4 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
            let zOnes = [{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 2, c: 5 }];

            if (random === 0)
                return this.createTetrominoObject(3, 6, 5, 'i', iOnes);
            if (random === 1)
                return this.createTetrominoObject(3, 5, 4, 'j', jOnes);
            if (random === 2)
                return this.createTetrominoObject(3, 5, 4, 'l', lOnes);
            if (random === 3)
                return this.createTetrominoObject(4, 5, 5, 'o', oOnes);
            if (random === 4)
                return this.createTetrominoObject(3, 5, 4, 's', sOnes);
            if (random === 5)
                return this.createTetrominoObject(3, 5, 4, 't', tOnes);
            if (random === 6)
                return this.createTetrominoObject(3, 5, 4, 'z', zOnes);
        },

        createTetrominoObject: function (farLeftCLocation, farRightCLocation, rotationCLocation, letter, ones) {
            let tetrominoMatrix = [];
            for (let r = 0; r < 4; r++) {
                tetrominoMatrix[r] = [];
                for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                    tetrominoMatrix[r][c] = { status: 0 };
                }
            }

            ones.forEach(item => {
                tetrominoMatrix[item.r][item.c].status = 1;
            })

            tetromino = new Tetromino(farLeftCLocation, farRightCLocation, rotationCLocation, letter, tetrominoMatrix);
            return tetromino;
        },
        createNewRow: function () {
            for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                this.newRow[c] = { status: 0 };
            }

        },
        createInitialbackgroundMatrix: function () {
            for (let r = 0; r < BOXES_ROW_COUNT; r++) {
                this.backgroundMatrix[r] = [];
                for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                    this.backgroundMatrix[r][c] = { status: 0 };
                }
            }
            this.addCoordinates(this.backgroundMatrix);
        },
        drawBoxes: function (matrix) {
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (matrix[r][c].status === 0) {
                        color = "gray"
                    }
                    else {
                        color = "black"
                    }

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
        },
        addCoordinates: function (matrix) {
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
    };

    background.createInitialbackgroundMatrix();
    background.createNewRow();

    //key listener
    document.addEventListener("keydown", function (event) { keyDownHandler(event, background.currentTetromino); }, false);

    setInterval(function () { draw(background); }, ONE_SECOND);
}

class Tetromino {
    letter;
    tetrominoMatrix;

    lowestRLocation;

    farLeftCLocation;
    farRightCLocation;
    rotationCLocation;
    rotationState;

    tetrominoLength;

    keydownFlag = false;

    moveRight() {
        //if tetromino not pressed against right wall
        if (this.farRightCLocation < (this.tetrominoLength - 1)) {
            this.keydownFlag = true;

            this.farRightCLocation++; this.farLeftCLocation++; this.rotationCLocation++;

            this.tetrominoMatrix.forEach(item => {
                item.unshift(item.pop());
            })
        }
        //else don't
    }

    moveLeft() {
        //if tetromino not pressed against left wall
        if (this.farLeftCLocation > 0) {
            this.keydownFlag = true;

            this.farRightCLocation--; this.farLeftCLocation--; this.rotationCLocation--;

            this.tetrominoMatrix.forEach(item => {
                item.push(item.shift());
            })
        }
        //else don't    
    }

    rotate() {
        if (this.letter === 'i') {
            //iTetromino has only two positions
            if (this.rotationState > 1) {
                this.rotationState = 0;
            }
            //switching from vertical to horizontal
            if (this.rotationState === 1) {
                //if iTetromino against left wall or one away from left wall or against right wall, cant rotate
                if (this.farLeftCLocation < 2 || this.farRightCLocation === this.tetrominoLength - 1) {
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.lowestRLocation -= 2;
                    this.farLeftCLocation = this.rotationCLocation - 2;
                    this.farRightCLocation = this.rotationCLocation + 1;

                    //erase vertical
                    for (let r = this.lowestRLocation - 1; r < this.tetrominoMatrix.length; r++) {
                        this.tetrominoMatrix[r][this.rotationCLocation].status = 0;
                    }

                    //create horizontal
                    this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation].status = 1;
                    this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 2].status = 1;
                    this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
                }
            }
            //switching from horizontal to vertical
            else {
                //if iTetromino on bottom 2 rows row or if tetromino on top row
                if (this.lowestRLocation >= BOXES_ROW_COUNT - 2 || this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.lowestRLocation += 2;
                    this.farLeftCLocation = this.farRightCLocation = this.rotationCLocation;

                    //erase horizontal
                    for (let c = 0; c < this.tetrominoLength; c++) {
                        this.tetrominoMatrix[this.lowestRLocation - 2][c].status = 0;
                    }

                    //create vertical
                    for (let r = this.lowestRLocation - 3; r < this.tetrominoMatrix.length; r++) {
                        this.tetrominoMatrix[r][this.rotationCLocation].status = 1;
                    }
                }
            }
        }
        if (this.letter === 's') {
            //sTetromino has only two positions
            if (this.rotationState > 1) {
                this.rotationState = 0;
            }
            //switching from vertical to horizontal
            if (this.rotationState === 1) {
                //if sTetromino against right wall, cant rotate
                if (this.farRightCLocation === this.tetrominoLength - 1) {
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation + 1;

                    this.tetrominoMirror[0][this.rotationCLocation - 1].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 0;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 1;
                }
            }
            //switching from horizontal to vertical
            else {
                //if sTetromino on top row, can't rotate
                if (this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation - 1].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 0;
                }
            }
        }
        if (this.letter === 'z') {
            //zTetromino has only two positions
            if (this.rotationState > 1) {
                this.rotationState = 0;
            }
            //switching from vertical to horizontal
            if (this.rotationState === 1) {
                //if zTetromino against left wall, cant rotate
                if (this.farLeftCLocation === 0) {
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation - 1;

                    this.tetrominoMirror[0][this.rotationCLocation + 1].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 1;
                }
            }
            //switching from horizontal to vertical
            else {
                //if zTetromino on top row, can't rotate
                if (this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 0;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 0;
                }
            }
        }
        if (this.letter === 't') {
            //tTetromino has four positions
            if (this.rotationState > 3) {
                this.rotationState = 0;
            }
            //rotate from horizontal to vertical
            if (this.rotationState === 2) {
                //if zTetromino against top wall, cant rotate
                if (this.lowestRLocation === 0) {
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 3) {
                //if zTetromino against right wall, can't rotate
                if (this.farRightCLocation === this.tetrominoLength - 1) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation + 1;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 1;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 0) {
                //if zTetromino on top row, can't rotate
                if (this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 0;
                }
            }
            else if (this.rotationState === 1) {
                //if zTetromino against left wall, can't rotate
                if (this.farLeftCLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation - 1;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                }
            }
        }
        if (this.letter === 'l') {
            //lTetromino has four positions
            if (this.rotationState > 3) {
                this.rotationState = 0;
            }
            //rotate from horizontal to vertical
            if (this.rotationState === 0) {
                //if lTetromino against top wall, cant rotate
                if (this.lowestRLocation === 0) {
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 0;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 1) {
                //if lTetromino against left wall, can't rotate
                if (this.farLeftCLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation - 1;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;
                    this.tetrominoMirror[0][this.rotationCLocation + 1].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 1;
                    this.tetrominoMirror[2][this.rotationCLocation].status = 0;
                }
            }
            //switching from horizontal to vertical
            else if (this.rotationState === 2) {
                //if lTetromino on top row, can't rotate
                if (this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[0][this.rotationCLocation - 1].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 0;
                }
            }
            else if (this.rotationState === 3) {
                //if lTetromino against right wall, can't rotate
                if (this.farRightCLocation === this.tetrominoLength - 1) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation + 1;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;
                    this.tetrominoMirror[0][this.rotationCLocation - 1].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 1;
                }
            }
        }
        if (this.letter === 'j') {
            //jTetromino has four positions
            if (this.rotationState > 3) {
                this.rotationState = 0;
            }
            //rotate from horizontal to vertical
            if (this.rotationState === 0) {
                //if lTetromino against top wall, cant rotate
                if (this.lowestRLocation === 0) {
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[0][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 0;
                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 0;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 1) {
                //if jTetromino against left wall, can't rotate
                if (this.farLeftCLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farLeftCLocation = this.rotationCLocation - 1;

                    this.tetrominoMirror[0][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 1;
                    this.tetrominoMirror[2][this.rotationCLocation].status = 0;
                }
            }
            //switching from horizontal to vertical
            else if (this.rotationState === 2) {
                //if lTetromino on top row, can't rotate
                if (this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;

                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[2][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 1;
                }
            }
            else if (this.rotationState === 3) {
                //if jTetromino against right wall, can't rotate
                if (this.farRightCLocation === this.tetrominoLength - 1) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.keydownFlag = true;

                    this.farRightCLocation = this.rotationCLocation + 1;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 1;
                }
            }
        }
    }

    constructor(farLeftCLocation, farRightCLocation, rotationCLocation, letter, tetrominoMatrix) {
        this.farLeftCLocation = farLeftCLocation;
        this.farRightCLocation = farRightCLocation;
        this.rotationCLocation = rotationCLocation;
        this.letter = letter;
        this.tetrominoMatrix = tetrominoMatrix;
        this.rotationState = 0;
        this.lowestRLocation = this.letter === 'i' ? 1 : 2;
        this.tetrominoLength = 10;
    }
}