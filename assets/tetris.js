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

//arrays
let background = [];

//
const ONE_SECOND = 1000;

//used for sideways movement

let sidewaysFlag = false;

//used for tetromino rotation
let rotation = 0;
let rotateFlag;

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

draw = (newRow) => {
    if (!sidewaysFlag && !rotateFlag) {
        background.unshift(JSON.parse(JSON.stringify(newRow)));
        background.pop();
    }
    else {
        sidewaysFlag = false;
        rotateFlag = false;
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
    //addCoordinates(background);
}

createTetrominos = () => {
    let tetrominos = [];
    let iOnes = [{ r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 3, c: 6 }];
    let jOnes = [{ r: 2, c: 3 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let lOnes = [{ r: 2, c: 5 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let oOnes = [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let sOnes = [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 3, c: 3 }, { r: 3, c: 4 }];
    let tOnes = [{ r: 2, c: 4 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let zOnes = [{ r: 2, c: 3 }, { r: 2, c: 4 }, { r: 3, c: 4 }, { r: 3, c: 5 }];

    tetrominos.push(createTetromino(iOnes));
    tetrominos.push(createTetromino(jOnes));
    tetrominos.push(createTetromino(lOnes));
    tetrominos.push(createTetromino(oOnes));
    tetrominos.push(createTetromino(sOnes));
    tetrominos.push(createTetromino(tOnes));
    tetrominos.push(createTetromino(zOnes));

    return tetrominos;
}

createTetromino = (ones) => {
    let tetromino = [];
    for (let r = 0; r < 4; r++) {
        tetromino[r] = [];
        for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
            tetromino[r][c] = { status: 0 };
        }
    }

    ones.forEach(item => {
        tetromino[item.r][item.c].status = 1;
    })

    return tetromino;
}

//key listener function
keyDownHandler = (event, rand, currentTetromino) => {
    var code = event.which;
    switch (code) {
        //space
        case 32:
            break;
        //right arrow
        case 39:
            sidewaysFlag = true;
            currentTetromino.forEach(item => {
                //if tetromino pressed against right wall
                if (item[item.length - 1].status === 1) {
                    sidewaysFlag = false;
                    return;
                }
            });

            if (sidewaysFlag) {
                currentTetromino.forEach(item => {
                    item.unshift(item.pop());
                })
            }
            break;
        //left arrow
        case 37:
            sidewaysFlag = true;

            currentTetromino.forEach(item => {
                //if tetromino pressed against left wall
                if (item[0].status === 1) {
                    sidewaysFlag = false;
                    return;
                }
            });
            if (sidewaysFlag) {
                currentTetromino.forEach(item => {
                    item.push(item.shift());
                })
            }
            break;
        //up arrow
        case 38:
            rotateFlag = true;
            rotation++;
            //iTetromino has only two positions
            if (rand === 0) {
                if (rotation > 1) {
                    rotation = 0;
                }
                //switching from vertical to horizontal
                if (rotation === 0) {
                    //if tetromino against left wall or one away from left wall, cant rotate
                    if (currentTetromino[0][0].status === 1 || currentTetromino[0][1].status === 1
                        //if tetromino against right wall
                        || currentTetromino[0][BOXES_COLUMN_COUNT - 1].status === 1) {
                        rotateFlag = false;
                        return;
                    }

                    if (rotateFlag) {
                        //find what column the '1's are on
                        let columnIndex = currentTetromino[1].findIndex(x => x.status === 1);

                        currentTetromino[0][columnIndex].status = 0;
                        currentTetromino[1][columnIndex].status = 0;
                        currentTetromino[2][columnIndex].status = 0;

                        currentTetromino[3][columnIndex - 1].status = 1;
                        currentTetromino[3][columnIndex - 2].status = 1;
                        currentTetromino[3][columnIndex + 1].status = 1;

                    }
                }
                else if (rotation === 1) {
                    //if tetromino on bottom row
                    if (background[background.length - 1][3].status === 1 || background[background.length - 1][7].status === 1
                        //if tetromino on one from bottom row
                        || background[background.length - 2][3].status === 1 || background[background.length - 2][7].status === 1
                        //if tetromino on top row
                        || background[0][3].status === 1 || background[0][7].status === 1) {
                        rotateFlag = false;
                        return;
                    }

                    if (rotateFlag) {
                        for (let c = 0; c < currentTetromino[1].length; c++) {
                            currentTetromino[3][c].status = 0;
                        }
                        for (let r = 0; r < 4; r++) {
                            currentTetromino[r][6].status = 1;
                        }

                    }
                }

            }
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
    let tempTetromnio;
    let rand;
    let currentTetromino = [];
    rand = Math.round(Math.random() * (tetrominos.length - 1));
    //rand = 0;
    let tetromino = tetrominos[rand];
    createInitialBackgroundArray();

    //key listener
    document.addEventListener("keydown", function(){keyDownHandler(event, rand, currentTetromino);}, false);

    for (let r = tetromino.length - 1; r >= 0; r--) {
        tempTetromnio = JSON.parse(JSON.stringify(tetromino[r]));
        currentTetromino.unshift(tempTetromnio);
        background.unshift(tempTetromnio);
    }
    setInterval(function () { draw(newRow); }, ONE_SECOND);
}