var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2; 
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

var bricks = [];
for (col = 0; col < brickColCount; col++){
    bricks[col] = [];
    for(row = 0; row < brickRowCount; row++){
        bricks[col][row] = {x: 0, y: 0, status: 1};
    }
}

function drawBricks(){
    for(col = 0; col < brickColCount; col++){
        for(row = 0; row < brickRowCount; row++){
            if(bricks[col][row].status == 1){
                var brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
             }
        }
    }
}

function keyDownHandler(e){
    if(e.keyCode == 39){
        rightPressed = true; 
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 39){
        rightPressed = false; 
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection(){
    for (col = 0; col < brickColCount; col++){
        for (row = 0; row < brickRowCount; row++){
            var brick = bricks[col][row];
            if(brick.status == 1){
                if(x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y+brickHeight){
                    dy = -dy;
                    brick.status = 0;
                    score++;
                    if(score == brickRowCount * brickColCount){
                        alert('You won, congrats\nScore: '+ score);
                        document.location.reload();
                    } 
                }      
            }

        }
    }
}


function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: '+ score, 8, 20);
}

function drawLives(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: '+ lives, canvas.width -65, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore()
    drawLives()
    collisionDetection();

    if(y + dy - ballRadius < 0){
        dy = -dy;
    } else if( y + dy + ballRadius > canvas.height){
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        } else {
            lives--;
            if(!lives){
                alert('You lose !\nScore: '+ score);
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height-20;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width){
        dx = -dx
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

document.addEventListener('mousemove', mouseMoveHandler);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft
    if(relativeX - paddleWidth/2 > 0 && relativeX + paddleWidth/2 < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}
setInterval(draw, 10);