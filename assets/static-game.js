export default class StaticGame{
    constructor(gameUtil){
        this.staticMatrix = []
        this.GameUtil = gameUtil;
        this.BOXES_COLUMN_LENGTH = 10;
        this.BOXES_ROW_LENGTH = this.BOXES_COLUMN_LENGTH * 2;
    }

    createInitialStaticMatrix(){
        for (let r = 0; r < this.BOXES_ROW_LENGTH; r++) {
            this.staticMatrix[r] = [];
            for (let c = 0; c < this.BOXES_COLUMN_LENGTH; c++) {
                this.staticMatrix[r][c] = { status: 0 };
            }
        }
        this.GameUtil.addCoordinates(this.staticMatrix);
    }

    newRow(){
        let newRow = [];
        for (let c = 0; c < this.BOXES_COLUMN_LENGTH; c++) {
            newRow[c] = { status: 0 };
        }
        return newRow;
    }

    addTetrominoToStaticMatrix(tetromino, gameBoard) {
        for (let r = tetromino.lowestRLocation - 3; r <= tetromino.lowestRLocation; r++) {
            if (r < 0 || r >= this.BOXES_ROW_LENGTH) {
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
                this.GameUtil.score += 100;
                this.staticMatrix.splice(r, 1);
                this.addNewRowToStaticMatrix();
                this.GameUtil.addCoordinates(this.staticMatrix);
                gameBoard.clearRow()
                this.GameUtil.drawBoxes(this.staticMatrix, true);
            }
        }
    }
    addNewRowToStaticMatrix() {
        if (this.staticMatrix) {
            this.staticMatrix.unshift(this.newRow())
        }
    }
}