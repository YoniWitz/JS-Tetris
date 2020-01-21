
import * as Tetromino from './tetromino.js'
export default class DynamicGame{
    constructor(DEBUG){
        this.currentTetromino = null;
        this.BOXES_COLUMN_LENGTH = 10;
        this.BOXES_ROW_LENGTH = this.BOXES_COLUMN_LENGTH * 2;
        this.currentTetromino = null;
        this.NUMBER_OF_TETROMINOS = 7;
        this.DEBUG = DEBUG;
    }

    newRow(){
        let newRow = [];
        for (let c = 0; c < this.BOXES_COLUMN_LENGTH; c++) {
            newRow[c] = { status: 0 };
        }
        return newRow;
    }

    setRandomTetromino(){
        let random = Math.round(Math.random() * (this.NUMBER_OF_TETROMINOS) - 0.5);
        if (this.DEBUG) {
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
    }

    addNewRowToCurrentTetromino() {
        if (this.currentTetromino) {
            this.currentTetromino.tetrominoMatrix.unshift(this.newRow())
        }
    }
}