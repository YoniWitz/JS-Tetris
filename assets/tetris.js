let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const CANVAS_WIDTH = document.getElementById('myCanvas').width;
const GAME_WIDTH = CANVAS_WIDTH*.75;
const CANVAS_HEIGHT = document.getElementById('myCanvas').height;
const PADDING = 5;

//static board stuff
function drawBorderLines(){
    ctx.strokeStyle="#FF0000";
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle="#FF0000";
    ctx.strokeRect(PADDING, PADDING, GAME_WIDTH - PADDING*2, CANVAS_HEIGHT - PADDING*2);//for white background
}
function draw() {
    ctx.clearRect(PADDING * 2, PADDING * 2, GAME_WIDTH-PADDING* 3, CANVAS_HEIGHT-3*PADDING);
    requestAnimationFrame(draw);
}

drawBorderLines(); 
draw();