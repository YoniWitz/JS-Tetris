class GameBanner {
    bannerContext = "";
    constructor(gameBannerCanvas) {
        this.gameBannerCanvas = gameBannerCanvas;
        this.bannerContext = gameBannerCanvas.getContext('2d');
    }

    draw = function () {
        this.bannerContext.fillStyle = 'white';
        this.bannerContext.fillRect(0, 0, this.gameBannerCanvas.width, this.gameBannerCanvas.height);
        this.bannerContext.font = "30px Arial";
        this.bannerContext.fillStyle = 'black';
        this.bannerContext.fillText("My Tetris Game", 50, 30);
        this.bannerContext.font = "20px Arial";

        this.bannerContext.fillText("Instructions: ", 50, 60);
        this.bannerContext.fillText("1. Use right and left keyboard arrows to navigate.", 50, 90);
        this.bannerContext.fillText("2. Press up arrow to rotate tetromino", 50, 120);
        this.bannerContext.fillText("3. Press down arrow to jump one line", 50, 150);
        this.bannerContext.fillText("4. Press spacebar to drop the tetromino to the bottom", 50, 180);
        this.bannerContext.fillText("Earn 100 points for every filled line", 50, 250);

    }
}

export default GameBanner