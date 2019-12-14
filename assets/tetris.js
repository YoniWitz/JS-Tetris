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


let tetrominos = [];
let boxes = [];

//boxes stuff
drawSmallBoxes = (array) => {
    for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
        for (let r = 0; r < BOXES_ROW_COUNT; r++) {
            if (boxes[c][r].status === 0) {
                color = "gray"
            }
            else {
                color = "black"
            }
            let outerBoxX = PADDING * 2 + BOXES_PADDING * (1 + 2 * c) + (c * BOXES_BORDER_WIDTH);
            let outerBoxY = PADDING * 2 + BOXES_PADDING * (1 + 2 * r) + (r * BOXES_BORDER_HEIGHT);


            let innerBoxX = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * c) + (c * BOXES_INNER_BOX_WIDTH);
            let innerBoxY = PADDING * 2 + INNER_TO_OUTER_RATIO * BOXES_PADDING * (1 + 2 * r) + (r * BOXES_INNER_BOX_HEIGHT);

            boxes[c][r].x = outerBoxX;
            boxes[c][r].y = outerBoxY;
            ctx.beginPath();
            //outer box
            ctx.strokeRect(outerBoxX, outerBoxY, BOXES_BORDER_WIDTH, BOXES_BORDER_HEIGHT);
            //inner box
            ctx.rect(innerBoxX, innerBoxY, BOXES_INNER_BOX_WIDTH, BOXES_INNER_BOX_HEIGHT);
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

drawTetrominos = () => {
    // tetrominos.forEach( item =>)
}
draw = () => {
    ctx.clearRect(PADDING * 2, PADDING * 2, GAME_WIDTH - PADDING * 3, CANVAS_HEIGHT - 3 * PADDING);
    drawSmallBoxes("grey");
    requestAnimationFrame(draw);
}

createInitialBoxesArray = () => {
    for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
        boxes[c] = [];
        for (let r = 0; r < BOXES_ROW_COUNT; r++) {
            boxes[c][r] = { x: 0, y: 0, status: 0 };
        }
    }
}

createTetrominos = () => {
    let iOnes = [{ r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 3, c: 6 }];
    let jOnes = [{ r: 2, c: 3 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let lOnes = [{ r: 2, c: 5 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let oOnes = [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let sOnes = [{ r: 2, c: 4 }, { r: 2, c: 5 }, { r: 3, c: 3 }, { r: 3, c: 4 }];
    let tOnes = [{ r: 2, c: 4 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 }];
    let zOnes = [{ r: 2, c: 3 }, { r: 2, c: 4 }, { r: 3, c: 4 }, { r: 3, c: 5 }];

    let tetrominoI = createTetromino(iOnes);
    let tetrominoJ = createTetromino(jOnes);
    let tetrominoL = createTetromino(lOnes);
    let tetrominoO = createTetromino(oOnes);
    let tetrominoS = createTetromino(sOnes);
    let tetrominoT = createTetromino(tOnes);
    let tetrominoZ = createTetromino(zOnes);

    tetrominos.push(tetrominoI);
    tetrominos.push(tetrominoJ);
    tetrominos.push(tetrominoL);
    tetrominos.push(tetrominoO);
    tetrominos.push(tetrominoS);
    tetrominos.push(tetrominoT);
    tetrominos.push(tetrominoZ);
}

createTetromino = (ones) => {
    let tetromino = [];
    for (let r = 0; r < 4; r++) {
        tetromino[r] = [];
        for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
            tetromino[r][c] = 0;
        }
    }
    ones.forEach(item => {
        tetromino[item.r][item.c] = 1;
    })
    return tetromino;
}
//drawBorderLines();
createInitialBoxesArray();
createTetrominos();

draw();