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

const ONE_SECOND = 1000;
//
let background = [];

addCoordinates = (array) => {
    for (let r = 0; r < array.length; r++) {
        for (let c = 0; c < array[r].length; c++) {
            let outerBoxX = PADDING * 2 + BOXES_PADDING * (1 + 2 * c) + (c * BOXES_BORDER_WIDTH);
            let outerBoxY = PADDING * 2 + BOXES_PADDING * (1 + 2 * r) + (r * BOXES_BORDER_HEIGHT);

            let innerBoxX = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * c) + (c * BOXES_INNER_BOX_WIDTH);
            let innerBoxY = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * r) + (r * BOXES_INNER_BOX_HEIGHT);

            array[r][c].outerX = outerBoxX;
            array[r][c].outerY = outerBoxY;

            array[r][c].innerX = innerBoxX;
            array[r][c].innerY = innerBoxY;
        }
    }
}

createNewRow = () => {
    let newRow = [];
    for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
        newRow[c] = { status: 0 };
    }
    return newRow;
}

drawBoxes = (array) => {
    for (let r = 0; r < BOXES_ROW_COUNT; r++) {
        for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
            if (array[r][c].status === 0) {
                color = "gray"
            }
            else {
                color = "black"
            }

            ctx.beginPath();
            //outer box
            ctx.strokeRect(array[r][c].outerX, array[r][c].outerY, BOXES_BORDER_WIDTH, BOXES_BORDER_HEIGHT);
            //inner box
            ctx.rect(array[r][c].innerX, array[r][c].innerY, BOXES_INNER_BOX_WIDTH, BOXES_INNER_BOX_HEIGHT);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
    }
}

//static board stuff
drawBorderLines = () => {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(PADDING, PADDING, GAME_WIDTH - PADDING * 2, CANVAS_HEIGHT - PADDING * 2);//for white background
}

draw = (newRow, currentTetromino) => {
    if (!currentTetromino.sidewaysMovementFlag && !currentTetromino.rotateFlag) {
        background.unshift(JSON.parse(JSON.stringify(newRow)));
        background.pop();
        currentTetromino.lowestRLocation++;
    }
    else {
        currentTetromino.sidewaysMovementFlag = false;
        currentTetromino.rotateFlag = false
    }

    addCoordinates(background);
    ctx.clearRect(PADDING * 2, PADDING * 2, GAME_WIDTH - PADDING * 3, CANVAS_HEIGHT - 3 * PADDING);
    drawBoxes(background);
    // requestAnimationFrame(draw);
}

createInitialBackgroundArray = () => {
    for (let r = 0; r < BOXES_ROW_COUNT; r++) {
        background[r] = [];
        for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
            background[r][c] = { status: 0 };
        }
    }
}

createTetrominos = () => {
    let tetrominos = [];
    let iOnes = [{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 }];
    let jOnes = [{ r: 1, c: 3 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
    let lOnes = [{ r: 1, c: 5 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
    let oOnes = [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let sOnes = [{ r: 1, c: 4 }, { r: 1, c: 5 }, { r: 2, c: 3 }, { r: 2, c: 4 }];
    let tOnes = [{ r: 1, c: 4 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }];
    let zOnes = [{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 2, c: 5 }];

    tetrominos.push(createTetrominoObject(3, 6, 5, 'i', iOnes));
    tetrominos.push(createTetrominoObject(3, 5, 4, 'j', jOnes));
    tetrominos.push(createTetrominoObject(3, 5, 4, 'l', lOnes));
    tetrominos.push(createTetrominoObject(4, 5, 5, 'o', oOnes));
    tetrominos.push(createTetrominoObject(3, 5, 4, 's', sOnes));
    tetrominos.push(createTetrominoObject(3, 5, 4, 't', tOnes));
    tetrominos.push(createTetrominoObject(3, 5, 4, 'z', zOnes));

    return tetrominos;
}

createTetrominoObject = (farLeftCLocation, farRightCLocation, rotationCLocation, letter, ones) => {
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
    let tetrominos = createTetrominos();
    let newRow = createNewRow();
    let tempTetromino;
    let rand;

    rand = Math.round(Math.random() * (tetrominos.length - 1));
    if (DEBUG) {
        rand = 2;
    }

    let currentTetromino = tetrominos[rand];
    createInitialBackgroundArray();

    //key listener
    document.addEventListener("keydown", function (event) { keyDownHandler(event, currentTetromino); }, false);

    for (let r = currentTetromino.tetrominoMatrix.length - 1; r >= 0; r--) {
        tempTetromino = JSON.parse(JSON.stringify(currentTetromino.tetrominoMatrix[r]));
        currentTetromino.tetrominoMirror.unshift(tempTetromino)
        background.unshift(tempTetromino);
    }
    setInterval(function () { draw(newRow, currentTetromino); }, ONE_SECOND);
}

class Tetromino {
    letter;
    tetrominoMatrix;

    lowestRLocation;
    farLeftCLocation;
    farRightCLocation;
    rotationCLocation;
    rotationState;
    tetrominoMirror;

    length;

    sidewaysMovementFlag = false;
    rotateFlag = false;

    moveRight() {
        //if tetromino not pressed against right wall
        if (this.farRightCLocation < (this.length - 1)) {
            this.sidewaysMovementFlag = true;
            this.farRightCLocation++; this.farLeftCLocation++; this.rotationCLocation++;
            this.tetrominoMirror.forEach(item => {
                item.unshift(item.pop());
            })
        }
        //else don't
    }

    moveLeft() {
        //if tetromino not pressed against left wall
        if (this.farLeftCLocation > 0) {
            this.sidewaysMovementFlag = true;
            this.farRightCLocation--; this.farLeftCLocation--; this.rotationCLocation--;
            this.tetrominoMirror.forEach(item => {
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
            //switching from horizontal to vertical
            if (this.rotationState === 1) {
                //if iTetromino against left wall or one away from left wall or against right wall, cant rotate
                if (this.farLeftCLocation < 2 || this.farRightCLocation === this.length - 1) {
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;
                    this.farLeftCLocation = this.rotationCLocation - 2;
                    this.farRightCLocation = this.rotationCLocation + 1;

                    //erase horizontal
                    for (let r = 0; r < this.tetrominoMatrix.length; r++) {
                        this.tetrominoMirror[r][this.rotationCLocation].status = 0;
                    }

                    //create vertical
                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation - 2].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;
                }
            }
            //switching from vertical to horizontal

            else {
                //if iTetromino on bottom 2 rows row if tetromino on top row
                if (this.lowestRLocation >= BOXES_ROW_COUNT - 2 || this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;
                    this.farLeftCLocation = this.farRightCLocation = this.rotationCLocation;

                    //erase horizontal
                    for (let c = 0; c < this.length; c++) {
                        this.tetrominoMirror[1][c].status = 0;
                    }

                    //create vertical
                    for (let r = 0; r < this.tetrominoMatrix.length; r++) {
                        this.tetrominoMirror[r][this.rotationCLocation].status = 1;
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
                if (this.farRightCLocation === this.length - 1) {
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;

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
                    this.rotateFlag = true;
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
                    this.rotateFlag = true;

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
                    this.rotateFlag = true;
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
                    this.rotateFlag = true;

                    this.farRightCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 3) {
                //if zTetromino against right wall, can't rotate
                if (this.farRightCLocation === this.length - 1) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;
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
                    this.rotateFlag = true;
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
                    this.rotateFlag = true;
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
                    this.rotateFlag = true;

                    this.farLeftCLocation = this.rotationCLocation;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 0;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 1) {
                //if zTetromino against left wall, can't rotate
                if (this.farLeftCLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;
                    this.farLeftCLocation = this.rotationCLocation - 1;

                    this.tetrominoMirror[0][this.rotationCLocation].status = 0;

                    this.tetrominoMirror[1][this.rotationCLocation - 1].status = 1;
                    this.tetrominoMirror[1][this.rotationCLocation + 1].status = 1;

                    this.tetrominoMirror[2][this.rotationCLocation + 1].status = 0;
                    this.tetrominoMirror[2][this.rotationCLocation].status = 0;
                    this.tetrominoMirror[2][this.rotationCLocation - 1].status = 1;
                }
            }
            //switching from vertical to horizontal
            else if (this.rotationState === 2) {
                //if lTetromino on top row, can't rotate
                if (this.lowestRLocation === 0) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;
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
                //if sTetromino against right wall, can't rotate
                if (this.farRightCLocation === this.length - 1) {
                    //do nothing
                }
                else {
                    this.rotationState++;
                    this.rotateFlag = true;
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
    }

    constructor(farLeftCLocation, farRightCLocation, rotationCLocation, letter, tetrominoMatrix) {
        this.farLeftCLocation = farLeftCLocation;
        this.farRightCLocation = farRightCLocation;
        this.rotationCLocation = rotationCLocation;
        this.letter = letter;
        this.tetrominoMatrix = tetrominoMatrix;
        this.rotationState = 0;
        this.tetrominoMirror = [];
        this.lowestRLocation = 1;
        this.length = this.tetrominoMatrix[0].length;
    }
}