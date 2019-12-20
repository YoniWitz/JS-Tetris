const BOXES_COLUMN_COUNT = 10;
const BOXES_ROW_COUNT = BOXES_COLUMN_COUNT * 2;
class Tetromino {
    rotationState = 0;
    keydownFlag = false;

    moveRight() {
        this.keydownFlag = true;

        this.farRightCLocation++; this.farLeftCLocation++; this.rotationCLocation++;

        this.tetrominoMatrix.forEach(item => {
            item.unshift(item.pop());
        })
    }

    moveLeft() {
        this.keydownFlag = true;

        this.farRightCLocation--; this.farLeftCLocation--; this.rotationCLocation--;

        this.tetrominoMatrix.forEach(item => {
            item.push(item.shift());
        })
    }

    createTetrominoMatrix(onesMatrix) {
        let tetrominoMatrix = [];
        for (let r = 0; r < 4; r++) {
            tetrominoMatrix[r] = [];
            for (let c = 0; c < BOXES_COLUMN_COUNT; c++) {
                tetrominoMatrix[r][c] = { status: 0 };
            }
        }

        onesMatrix.forEach(item => {
            tetrominoMatrix[item.r][item.c].status = 1;
        })
        return tetrominoMatrix;
    }

    constructor(onesMatrix) {
        this.tetrominoMatrix = this.createTetrominoMatrix(onesMatrix);
        this.tetrominoNumOfColumns = this.tetrominoMatrix[0].length;
    }
}

export class ITetromino extends Tetromino {
    rotate() {
        //iTetromino has only two positions
        if (this.rotationState > 1) {
            this.rotationState = 0;
        }
        //switching from vertical to horizontal
        if (this.rotationState === 1) {
            //if iTetromino against left wall or one away from left wall or against right wall, cant rotate
            if (this.farLeftCLocation < 2 || this.farRightCLocation === this.tetrominoNumOfColumns - 1) {
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
                for (let c = 0; c < this.tetrominoNumOfColumns; c++) {
                    this.tetrominoMatrix[this.lowestRLocation - 2][c].status = 0;
                }

                //create vertical
                for (let r = this.lowestRLocation - 3; r < this.tetrominoMatrix.length; r++) {
                    this.tetrominoMatrix[r][this.rotationCLocation].status = 1;
                }
            }
        }
    }

    constructor() {
        super([{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 6;
        this.rotationCLocation = 5;
        this.lowestRLocation = 1;
    }
}

export class JTetromino extends Tetromino {
    rotate() {
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 0;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation].status = 0;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation].status = 1;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
            }
        }
        else if (this.rotationState === 3) {
            //if jTetromino against right wall, can't rotate
            if (this.farRightCLocation === this.tetrominoNumOfColumns - 1) {
                //do nothing
            }
            else {
                this.rotationState++;
                this.keydownFlag = true;

                this.farRightCLocation = this.rotationCLocation + 1;

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
            }
        }
    }

    constructor() {
        super([{ r: 1, c: 3 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
        this.lowestRLocation = 2;
    }
}

export class LTetromino extends Tetromino {
    rotate() {
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation].status = 0;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation - 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation].status = 1;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
            }
        }
        else if (this.rotationState === 3) {
            //if lTetromino against right wall, can't rotate
            if (this.farRightCLocation === this.tetrominoNumOfColumns - 1) {
                //do nothing
            }
            else {
                this.rotationState++;
                this.keydownFlag = true;

                this.farRightCLocation = this.rotationCLocation + 1;

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation - 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
            }
        }
    }

    constructor() {
        super([{ r: 1, c: 5 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
        this.lowestRLocation = 2;
    }
}

export class OTetromino extends Tetromino {
    constructor() {
        super([{ r: 1, c: 4 }, { r: 1, c: 5 }, { r: 2, c: 4 }, { r: 2, c: 5 }]);
        this.farLeftCLocation = 4;
        this.farRightCLocation = 5;
        this.rotationCLocation = 5;
        this.lowestRLocation = 2;
    }
}

export class STetromino extends Tetromino {
    rotate() {
        //sTetromino has only two positions
        if (this.rotationState > 1) {
            this.rotationState = 0;
        }
        //switching from vertical to horizontal
        if (this.rotationState === 1) {
            //if sTetromino against right wall, cant rotate
            if (this.farRightCLocation === this.tetrominoNumOfColumns - 1) {
            }
            else {
                this.rotationState++;
                this.keydownFlag = true;

                this.farRightCLocation = this.rotationCLocation + 1;

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation - 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation - 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
            }
        }
    }

    constructor() {
        super([{ r: 1, c: 4 }, { r: 1, c: 5 }, { r: 2, c: 3 }, { r: 2, c: 4 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
        this.lowestRLocation = 2;
    }
}

export class TTetromino extends Tetromino {
    rotate() {
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;
            }
        }
        //switching from vertical to horizontal
        else if (this.rotationState === 3) {
            //if zTetromino against right wall, can't rotate
            if (this.farRightCLocation === this.tetrominoNumOfColumns - 1) {
                //do nothing
            }
            else {
                this.rotationState++;
                this.keydownFlag = true;

                this.farRightCLocation = this.rotationCLocation + 1;

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
            }
        }
    }
    constructor() {
        super([{ r: 1, c: 4 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
        this.lowestRLocation = 2;
    }
}

export class ZTetromino extends Tetromino {
    rotate() {
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation + 1].status = 0;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
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

                this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;
                this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

                this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 0;
            }
        }
    }
    constructor() {
        super([{ r: 1, c: 3 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 2, c: 5 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
        this.lowestRLocation = 2;
    }
}