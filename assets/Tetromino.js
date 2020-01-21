const BOXES_COLUMN_LENGTH = 10;

class Tetromino {
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
            for (let c = 0; c < BOXES_COLUMN_LENGTH; c++) {
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
        this.lowestRLocation = 2;
        this.rotationState = 1;
        this.keydownFlag = false;
    }
}

export class ITetromino extends Tetromino {
    rotate() {
        //switching from vertical to horizontal
        if (this.rotationState === 1) {
            //iTetromino has only two states
            this.rotationState = 0;
            this.keydownFlag = true;

            this.farLeftCLocation = this.rotationCLocation - 2;
            this.farRightCLocation = this.rotationCLocation + 1;

            //erase vertical
            for (let r = this.lowestRLocation - 3; r < this.tetrominoMatrix.length; r++) {
                this.tetrominoMatrix[r][this.rotationCLocation].status = 0;
            }

            this.lowestRLocation -= 2;

            //create horizontal
            for (let c = this.farLeftCLocation; c <= this.farRightCLocation; c++) {
                this.tetrominoMatrix[this.lowestRLocation][c].status = 1;
            }
        }
        //switching from horizontal to vertical
        else {
            this.rotationState++;
            this.keydownFlag = true;

            //erase horizontal
            for (let c = this.farLeftCLocation; c <= this.farRightCLocation; c++) {
                this.tetrominoMatrix[this.lowestRLocation][c].status = 0;
            }

            this.lowestRLocation += 2;

            this.farLeftCLocation = this.farRightCLocation = this.rotationCLocation;
            //create vertical
            for (let r = this.lowestRLocation - 3; r < this.tetrominoMatrix.length; r++) {
                this.tetrominoMatrix[r][this.rotationCLocation].status = 1;
            }
        }
    }

    constructor() {
        super([{ r: 0, c: 5 }, { r: 1, c: 5 }, { r: 2, c: 5 }, { r: 3, c: 5 }]);
        this.farLeftCLocation = 5;
        this.farRightCLocation = 5;
        this.rotationCLocation = 5;
        this.lowestRLocation = 3;
    }
}

export class JTetromino extends Tetromino {
    rotate() {
        //rotate from horizontal to vertical
        if (this.rotationState === 0) {
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
        //switching from vertical to horizontal
        else if (this.rotationState === 1) {
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
        //switching from horizontal to vertical
        else if (this.rotationState === 2) {
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
        else if (this.rotationState === 3) {
            //jTetromino has four states
            this.rotationState = 0;
            this.keydownFlag = true;

            this.farRightCLocation = this.rotationCLocation + 1;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation].status = 0;

            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
        }
    }

    constructor() {
        super([{ r: 0, c: 4 }, { r: 0, c: 5 }, { r: 1, c: 4 }, { r: 2, c: 4 }]);
        this.farLeftCLocation = 4;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
    }
}

export class LTetromino extends Tetromino {
    rotate() {
        //rotate from horizontal to vertical
        if (this.rotationState === 0) {
            this.rotationState++;
            this.keydownFlag = true;

            this.farLeftCLocation = this.rotationCLocation;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation].status = 1;
            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;

            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
        }
        //switching from vertical to horizontal
        else if (this.rotationState === 1) {
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
        //switching from horizontal to vertical
        else if (this.rotationState === 2) {
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
        else if (this.rotationState === 3) {
            //lTetromino has four states      
            this.rotationState = 0;

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

    constructor() {
        super([{ r: 0, c: 4 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 2, c: 5 }]);
        this.farLeftCLocation = 4;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
    }
}

export class OTetromino extends Tetromino {
    rotate() { }
    constructor() {
        super([{ r: 1, c: 4 }, { r: 1, c: 5 }, { r: 0, c: 4 }, { r: 0, c: 5 }]);
        this.farLeftCLocation = 4;
        this.farRightCLocation = 5;
        this.lowestRLocation = 1;
    }
}

export class STetromino extends Tetromino {
    rotate() {
        //switching from vertical to horizontal
        if (this.rotationState === 1) {

            //sTetromino has only two states
            this.rotationState = 0;

            this.keydownFlag = true;

            this.farRightCLocation = this.rotationCLocation + 1;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation - 1].status = 0;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;
            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
        }
        //switching from horizontal to vertical
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

    constructor() {
        super([{ r: 0, c: 3 }, { r: 1, c: 3 }, { r: 1, c: 4 }, { r: 2, c: 4 }]);
        this.farLeftCLocation = 3;
        this.farRightCLocation = 4;
        this.rotationCLocation = 4;
    }
}

export class TTetromino extends Tetromino {
    rotate() {
        //rotate from horizontal to vertical
        if (this.rotationState === 2) {
            this.rotationState++;
            this.keydownFlag = true;

            this.farRightCLocation = this.rotationCLocation;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;
        }
        //switching from vertical to horizontal
        else if (this.rotationState === 3) {
            //tTetromino has four states
            this.rotationState = 0;
            this.keydownFlag = true;

            this.farRightCLocation = this.rotationCLocation + 1;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 0;

            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 1;
            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
        }
        //switching from vertical to horizontal
        else if (this.rotationState === 0) {
            this.rotationState++;
            this.keydownFlag = true;

            this.farLeftCLocation = this.rotationCLocation;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 1;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 1;

            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 0;
            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation - 1].status = 0;
        }
        else if (this.rotationState === 1) {
            this.rotationState++;
            this.keydownFlag = true;

            this.farLeftCLocation = this.rotationCLocation - 1;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation].status = 0;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;
        }
    }
    constructor() {
        super([{ r: 0, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 4 }, { r: 2, c: 4 }]);
        this.farLeftCLocation = 4;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
    }
}

export class ZTetromino extends Tetromino {
    rotate() {
        //switching from vertical to horizontal
        if (this.rotationState === 1) {
            //zTetromino has only two states      
            this.rotationState = 0;
            this.keydownFlag = true;

            this.farLeftCLocation = this.rotationCLocation - 1;

            this.tetrominoMatrix[this.lowestRLocation - 2][this.rotationCLocation + 1].status = 0;

            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation + 1].status = 0;
            this.tetrominoMatrix[this.lowestRLocation - 1][this.rotationCLocation - 1].status = 1;

            this.tetrominoMatrix[this.lowestRLocation][this.rotationCLocation + 1].status = 1;
        }
        //switching from horizontal to vertical
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
    constructor() {
        super([{ r: 0, c: 5 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 2, c: 4 }]);
        this.farLeftCLocation = 4;
        this.farRightCLocation = 5;
        this.rotationCLocation = 4;
    }
}