//clear screen on eat and die, dont clear tail if apple is on it

//create const for canvas element and set sizing
const c = document.getElementById("canvas");

//create const for context with mode set to '2d'
const ctx = c.getContext('2d');

//class instance for storing position of each pixel of snake
class Pos {
      constructor(x, y, prev) {
        this.x = x;
        this.y = y;
        this.prev = prev;
      }
}

//create player character object
const snake = {
  head: undefined,
  tail: undefined,
  dx: 0,
  dy : 0,
  color : "green",
};

//create apple object
const apple = {
  x : 0,
  y : 0,
  color : "red"
}

//global game state variables
let score, die, clear;
//movement flags
let up, down, left, right;

//grid size
const gridSize = 50;
const frameTime = 50;

//set width to a multiple of grid size to make grid
c.width = Math.floor(window.innerWidth/gridSize)*gridSize;
c.height = Math.floor(window.innerHeight/gridSize)*gridSize;

const gridWidth = c.width/gridSize;
const gridHeight = c.height/gridSize;

//draw function for drawing objects
const draw = (pos, color) =>{
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(pos.x,pos.y,gridSize,gridSize);
} 

//move tail to head, new head is old tail
const moveSnake = () => {
  let new_head = snake.tail;
  clear = new Pos(snake.tail.x,snake.tail.y,null);
  snake.tail = new_head.prev;
  new_head.prev = null;
  new_head.x = snake.head.x + snake.dx;
  new_head.y = snake.head.y + snake.dy;
  snake.head.prev = new_head;
  snake.head = new_head;
  
}

//move character
const move = () => {
  //check flags
  if(up){
    snake.dy = -gridSize;
    snake.dx = 0;
  } else if(down){
    snake.dy = gridSize;
    snake.dx = 0;
  } else if(left){
    snake.dx = -gridSize;
    snake.dy = 0;
  } else if(right){
    snake.dx = gridSize;
    snake.dy = 0;
  }
  
  //change position
  moveSnake();
}

//wrap from one side of the screen to the other
const wrap = () => {
  if(snake.head.x>c.width-gridSize){
    snake.head.x = 0;
  } else if(snake.head.x<0){
    snake.head.x = c.width-gridSize;
  }
  if(snake.head.y>c.height-gridSize){
    snake.head.y = gridSize;
  } else if(snake.head.y<gridSize){
    snake.head.y = c.height-gridSize;
  }
}

//update score, respawn apple, and lengthen snake
const eat = () => {
  //increment score
  score += 10;
  drawScore();
  //relocate apple
  apple.x = Math.floor(Math.random()*gridWidth)*gridSize;
  apple.y = Math.floor(Math.random()*(gridHeight-1))*gridSize+gridSize;
  draw(apple, apple.color);
  
  snake.tail = new Pos(c.width,c.height,snake.tail);
  //clear = null;
}

//display score at the top of the screen
const drawScore = () => {
  ctx.clearRect(0,0,150,24);
  ctx.fillStyle = "white";
  ctx.font = "24px fantasy";
  ctx.fillText(`Score: ${score}`,5,20);
}

//check collisions
const collide = () => {
  let node = snake.tail;
  while(node.prev){
    if(snake.head.x===node.x&&snake.head.y===node.y){
      die = true;
    }
    node = node.prev;
  }
}

const drawStuff = () => {
  if(clear && (clear.x!==apple.x||clear.y!==apple.y)){ 
     ctx.clearRect(clear.x,clear.y,gridSize,gridSize);
}
  draw(snake.head, snake.color);
}

//CHANGE LAST
//recursively looping animate function
const animate = () => {
  //clear screen
  //ctx.clearRect(0,0,c.width,c.height);
  //keep animating until die
  if(!(die)){
    setTimeout(animate, frameTime);
  } else {
    init();
  }
  //draw frame
  drawStuff();
  //move
  move();
  //wrap around side
  wrap();
  //eat
  if(snake.head.x === apple.x && snake.head.y === apple.y){
    eat();
  }
  //check collision
  collide();
}

//create nodes for snake
const createSnake = () => {
  let x = Math.floor((c.width/2)/gridSize)*gridSize;
  let y = Math.floor((c.height/2)/gridSize)*gridSize;
  snake.head = new Pos(x,y,null);
  let prev = snake.head;
  for(let i=0;i<4;i++){
    draw(prev, snake.color);
    x -= gridSize;
    prev = new Pos(x,y,prev);
  }
  draw(prev, snake.color);
  snake.tail = prev;
}

const init = () => {
  //clear values and screen
  ctx.clearRect(0,0,c.width,c.height);
  score = 0;
  snake.dx = 0;
  snake.dy = 0;
  die = false;
  
  //create snake
  createSnake();
  
  //draw scoreboard
  drawScore();
  
  //start moving right
  right = true;
  left = false;
  up = false;
  down = false;
  
  //initial values for apple
  apple.x = Math.floor(Math.random()*gridWidth)*gridSize;
  apple.y = Math.floor(Math.random()*(gridHeight-1))*gridSize+gridSize;
  draw(apple, apple.color);
  
  //start animation loop
  animate();
}

//set flags
const keyDown = (event) => {
  const key = event.key
  
  if(snake.dx && (key === 'ArrowUp' || key === 'w')) {
    up = true;
    down = false;
    left = false;
    right = false;
    return;
  } 
  if (snake.dx && (key === "ArrowDown" || key === "s")) {
    down = true;
    up = false;
    left = false;
    right = false;
    return;
  }
  if (snake.dy && (key === "ArrowLeft" || key === "a")) {
    left = true;
    right = false;
    up = false;
    down = false;
    return;
  }
  if(snake.dy && (key === 'ArrowRight' || key === 'd')) {
    right = true;
    left = false;
    up = false;
    down = false;
    return;
  }
}

//listen for key presses and releases
document.addEventListener('keydown', keyDown);

//begin
init();