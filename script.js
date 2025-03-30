let BALL_DRAG = false;

let BALL_START_X = 0;
let BALL_START_Y = 0;
let BALL_END_X = 0;
let BALL_END_Y = 0;
let FORCE = 0;

const ball = document.getElementById("ball");
const guide = document.getElementById("guide");
const pins = document.querySelectorAll(".pin");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("scoreDisplay");
const strikeSound = document.getElementById("strikeSound"); 
let score = 0;
let gameOver = false; 

const ORIGINAL_BALL_POSITION = { top: '400px', left: 'calc(50% - 30px)' }; 

const handleGrab = (event) => {
    if (gameOver) return; 
    BALL_DRAG = true;
    BALL_START_X = event.pageX;
    BALL_START_Y = event.pageY;
}

const handleDragBall = (event) => {
    if (!BALL_DRAG || gameOver) return; 

    let mouseX = event.pageX;
    let mouseY = event.pageY;
    ball.style.top = mouseY - 30 + 'px'; 
    ball.style.left = mouseX - 30 + 'px'; 

    BALL_END_X = event.pageX;
    BALL_END_Y = event.pageY;

    adjustGuide();
}

const handleThrowBall = () => {
    if (gameOver) return;
    BALL_DRAG = false;
    let { angle_rad } = angleCalc();

    let interval = setInterval(() => {
        ball.style.top = parseInt(ball.style.top) - Math.cos(angle_rad) * 10 + 'px';
        ball.style.left = parseInt(ball.style.left) - Math.sin(angle_rad) * 10 + 'px';
        ball.classList.add("roll");

        
        if (checkCollision()) {
            clearInterval(interval);
            for (let pin of pins) {
                pin.classList.add("fall");
            }
            score += pins.length; 
            updateScore();
            message.classList.remove("hidden");

          
            strikeSound.play(); 

           
            setTimeout(() => {
                resetPins(); 
                resetBall(); 
            }, 1000); 
        }

        // Check if the ball has moved past a certain point without hitting any pins
        if (parseInt(ball.style.top) < 0) {
            clearInterval(interval);
            endGame(); 
        }
    }, 2000 / FORCE);
}

const angleCalc = () => {
    let adj = BALL_END_Y - BALL_START_Y;
    let opp = BALL_END_X - BALL_START_X;
    let tan = opp / adj;
    let angle_rad = Math.atan(tan);
    FORCE = Math.sqrt(Math.pow(opp, 2) + Math.pow(adj, 2));

    return {
        adj,
        angle_rad
    };
}

const adjustGuide = () => {
    let { adj, angle_rad } = angleCalc();
    guide.style.height = adj + 'px';
    guide.style.transform = `perspective(100px) rotate(${-angle_rad}rad) rotateX(${adj / 5}deg)`;
}

const checkCollision = () => {
    const ballRect = ball.getBoundingClientRect();
    for (let pin of pins) {
        const pinRect = pin.getBoundingClientRect();
        if (
            ballRect.x < pinRect.x + pinRect.width &&
            ballRect.x + ballRect.width > pinRect.x &&
            ballRect.y < pinRect.y + pinRect.height &&
            ballRect.y + ballRect.height > pinRect.y
        ) {
            return true; 
        }
    }
    return false; 
}

const updateScore = () => {
    scoreDisplay.innerText = `Score: ${score}`; 
}

const resetPins = () => {
    for (let pin of pins) {
        pin.classList.remove("fall"); 
    }
    message.classList.add("hidden"); 
}

const resetBall = () => {
    ball.style.top = ORIGINAL_BALL_POSITION.top;
    ball.style.left = ORIGINAL_BALL_POSITION.left;
}

const endGame = () => {
    gameOver = true; 
    alert("Game Over! You missed all the pins."); 
    resetGame(); 
}

const resetGame = () => {
    score = 0; 
    updateScore(); 
    resetPins(); 
    resetBall(); 
    gameOver = false;
}

ball.addEventListener('pointerdown', handleGrab);
ball.addEventListener('pointerup', handleThrowBall);
document.addEventListener('pointermove', handleDragBall);