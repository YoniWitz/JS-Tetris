export default class GameBoard {
    PADDING = 5
    ctx=null;
    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.ctx = this.gameCanvas.getContext('2d')
    }
    clearBoard() {
        ctx.clearRect(PADDING * 2, 0, this.ctx.width, this.ctx.height - 3 * PADDING);
    }
}