export default class GameBoard {
    PADDING = 5

    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.ctx = this.gameCanvas.getContext('2d');
        this.GAME_WIDTH = this.gameCanvas.width * .75
        this.CANVAS_HEIGHT = this.gameCanvas.height;
        this.BOXES_COLUMN_LENGTH = 10;
        this.BOXES_SIZE = this.GAME_WIDTH / this.BOXES_COLUMN_LENGTH;
        this.BOXES_PADDING = 2;
        this.BOXES_BORDER_WIDTH = this.BOXES_SIZE - 2 * this.BOXES_PADDING;
        this.BOXES_BORDER_HEIGHT = this.BOXES_BORDER_WIDTH;
        this.INNER_TO_OUTER_RATIO = 3.5;

        this.BOXES_INNER_BOX_WIDTH = this.BOXES_SIZE - this.INNER_TO_OUTER_RATIO * 2 * this.BOXES_PADDING;
        this.BOXES_INNER_BOX_HEIGHT = this.BOXES_INNER_BOX_WIDTH;

        this.CANVAS_WIDTH = this.gameCanvas.width;
        this.GAME_WIDTH = this.CANVAS_WIDTH * .75;
    }
    clearBoard() {
        this.ctx.clearRect(this.PADDING * 2, 0, this.gameCanvas.width, this.gameCanvas.height - 3 * this.PADDING);
    }

    clearRow() {
        this.ctx.clearRect(this.PADDING * 2, this.PADDING * 2, this.GAME_WIDTH - this.PADDING * 3, this.CANVAS_HEIGHT - 3 * this.PADDING);
    }

    drawScore(score) {
        this.ctx.font = "15px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: " + score, this.gameCanvas.width - 85, 20);
    }

    drawBoxes(matrix, isBackground) {
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
                    this.ctx.beginPath();
                    //outer box
                    this.ctx.strokeRect(matrix[r][c].outerX, matrix[r][c].outerY, this.BOXES_BORDER_WIDTH, this.BOXES_BORDER_HEIGHT);
                    //inner box
                    this.ctx.rect(matrix[r][c].innerX, matrix[r][c].innerY, this.BOXES_INNER_BOX_WIDTH, this.BOXES_INNER_BOX_HEIGHT);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }
}