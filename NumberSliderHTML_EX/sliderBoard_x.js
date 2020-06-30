// sliderBoard_x.js
// date : 27 June 2020
// What's new:
// - no more picture. It draws tiles itself with new drawTiles command.

const TILE_WIDTH = 60;
const MAXIMUM_NUMBER_OF_IMAGE =25;
var Super_Player=false;
var numberOfTilesPerRow = 3;
var numberOfTilesPerColumn = 3;
var Shuffling_Tile = false;
var Game_Completed = true;

var Vertical_Direction=false;
var numberOfTiles;
var currentPattern = [];
var targetPattern=[];
var coordinates=[];
class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}
var board = document.getElementById("canvas");
var ctx = board.getContext("2d");
var btnNewGame = document.getElementById('newGame');
var chkRandom = document.getElementById('chkRandom');
var label = document.getElementById('boardSizeHeader');
window.onload = function() {
 
// Create gradient
var gradient = ctx.createLinearGradient(0, 0, board.width, 0);
gradient.addColorStop("0", "yellow");
gradient.addColorStop("0.5", "brown");
gradient.addColorStop("1.0", "red");
// Fill with gradient
ctx.font= "30px Tahoma";
ctx.strokeStyle = gradient;
ctx.strokeText("Number Slider...",45,70);
ctx.font= "18px Tahoma";
ctx.fillStyle= "blue";
ctx.fillText("Click 'New Game'",85,200);
ctx.fillText("to start playing.", 85,240);
};
//newGame();
btnNewGame.addEventListener('click',newGame);
label.addEventListener('click', function() {
    Super_Player = !Super_Player;
});
chkRandom.addEventListener('change',function(event) {
    if (event.target.checked){
         Shuffling_Tile=true;
    } else Shuffling_Tile=false;    
    if(!Game_Completed) newGame();
} );
//if (document.querySelector('input[name="boardSize"]')) {
    document.querySelectorAll('input[name="boardSize"]').forEach(function(element){
      element.addEventListener("change", function(event) {
        numberOfTilesPerRow = event.target.value;
        numberOfTilesPerColumn=event.target.value;
        if (!Game_Completed) newGame();
      });
    });
    
 board.addEventListener('click',function() {
    if (!Game_Completed) play() 
    else alert("Click 'New Game' button for start playing.");
});   

function play(){
    if  (!Game_Completed) {
    var indexOfClickedTile = getIndexOfClickedTile(coordinates,numberOfTiles,board,event);
    var indexOfEmptyTile = getIndexOfEmptyTile(currentPattern);
       if (isValidClicked(indexOfClickedTile,indexOfEmptyTile ,coordinates)|| Super_Player){
            currentPattern[indexOfEmptyTile] = currentPattern[indexOfClickedTile];
            currentPattern[indexOfClickedTile] = 0;
            drawTiles(coordinates,currentPattern);
            if (isGameOver()) {
               Game_Completed = true;
               var message = "Game Over"
                var x = (board.width - 25*message.length)/2;
                var y = board.height /2;
                if (numberOfTilesPerRow==3){
                    ctx.font="bold 30px Tahoma";
                    x=10;
                }   else  ctx.font= "bold 40px Tahoma";
                ctx.fillStyle= "white";
                ctx.fillText("Game Over",x,y); 
            } 

        }
        
    } 
}
function createTiles() {
 
     for (let i = 0; i < MAXIMUM_NUMBER_OF_IMAGE; i++) {
        tileImages[i]= new Image();
        tileImages[i].src= './img/'+String(i)+'.gif';
      }
 } 
function computeCoordinate() {
    let point=[];
    let count = 0;
    for (let y = 0; y < TILE_WIDTH * numberOfTilesPerRow; y = y + TILE_WIDTH) {
        for (let x = 0; x < TILE_WIDTH * numberOfTilesPerColumn; x = x + TILE_WIDTH) {
            point[count] = new Point(x, y);
            count++;
        }
     }
     return point;
}

// function drawTiles() {
//     for (let i =0; i < numberOfTiles; i++) {
//         ctx.drawImage(tileImages[currentPattern[i]], coordinates[i].x, coordinates[i].y);
//     }
// }
function drawTiles(point, number) {
    var dx,dy;
    
                ctx.font="bold 30px TimesRoman";
                ctx.clearRect(0,0, numberOfTilesPerRow*TILE_WIDTH, numberOfTilesPerRow*TILE_WIDTH);
    
            for (let i =0; i < numberOfTiles; i++) {
            if (number[i]==0) {
                ctx.fillStyle= "white";
                roundRect(ctx, point[i].x, point[i].y, TILE_WIDTH, TILE_WIDTH, 10, true,true);
            } else {
                ctx.fillStyle= "lightgreen";
                ctx.strokeStyle="darkblue";
                roundRect(ctx,point[i].x, point[i].y, TILE_WIDTH, TILE_WIDTH,10,true,true);
            //    ctx.strokeRoundRect(point[i].x, point[i].y, TILE_WIDTH, TILE_WIDTH, 20, 20);
                ctx.fillStyle="red";
             if (number[i] > 9) {
                    dx = TILE_WIDTH/2.0 - 15;
                }else {
                    dx = TILE_WIDTH/2.0 -5 ;
                }
                dy = TILE_WIDTH/2.0 + 10;
                ctx.fillText(String(number[i]), point[i].x + dx, point[i].y+ dy);
            }
        }
    }
 
function roundRect(ctx, x, y, width, height, radius, isFilled, isStroked) {
    if (typeof isStroked === 'undefined') {
        isStroked = true;
    }
    if (typeof isFilled === 'undefined') {
        isFilled = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y); // top left
    ctx.lineTo(x + width - radius, y); // top right
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius); //curve at top right
    ctx.lineTo(x + width, y + height - radius); // line to bottom right
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);// line to bottom left
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);//curve at bottom left
    ctx.lineTo(x, y + radius); // line to top left
    ctx.quadraticCurveTo(x, y, x + radius, y); //curve at top left
    ctx.closePath();
     if (isFilled) {
      ctx.fill();
    }
    if (isStroked) {
      ctx.stroke();
    }
 
  }
function newGame(){
    Game_Begin=true;
    Game_Completed = false;
   // movingCount = 0;
   numberOfTiles = numberOfTilesPerRow*numberOfTilesPerColumn;
   board.width = numberOfTilesPerColumn*TILE_WIDTH;
   board.height = numberOfTilesPerRow*TILE_WIDTH;
   currentPattern = setDefaultStartingPositon(numberOfTiles);
    targetPattern = designTargetPattern(numberOfTiles);
    coordinates = computeCoordinate();
    drawTiles(coordinates,currentPattern);
 }
function setDefaultStartingPositon(numberOfElements){
    array =[];
       for (let i = 0; i < numberOfElements - 3; i++) {
        array[i] = i + 1;
    }
    array[numberOfElements - 1] = 0;
    array[numberOfElements - 2] = numberOfElements - 2;
    array[numberOfElements - 3] = numberOfElements - 1;
    if (Shuffling_Tile) shuffleTiles(array,numberOfElements);
    return array;
}
function shuffleTiles(array,numberOfElements) {
    let count = 0;
    let temp;
    while ( count < numberOfElements -1) {
        // random number from 0 to numberOfTiles-2
        let n = Math.floor(Math.random()*(numberOfElements -1));
        temp = array[count];
        array[count] = array[n];
        array[n]= temp;
        count++;
    }
}
function designTargetPattern(numberOfElements){
    array=[];
    if (!Vertical_Direction) {
        for (let i = 0; i < numberOfElements - 1; i++) {
            array[i] = i + 1;
        }
        array[numberOfElements - 1] = 0;
    } else {
        let count =1;
        for (let c = 0; c < numberOfTilesPerColumn; c++) {
            let n = 0;
            for (let r = 0; r < numberOfTilesPerRow; r++) {
                array[c+n] = count;
                n = n + numberOfTilesPerRow;
                count++;
            }
        }
        array[numberOfElements -1]=0;
    }
    return array;
}
function getClickedPoint(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
 function getIndexOfEmptyTile ( array) {
    let index;
    for (let i = 0; i < array.length; i++){
        if (array[i] == 0) {
            index = i;
            break;
        }
    }
    return index;
}
function getIndexOfClickedTile( point, numberOfElements,canvas,event) {
    let indexOfClickedTile;
    let mousePosition = getClickedPoint(canvas,event);
  //  console.log( mousePosition.x + ' and '+ mousePosition.y)
    let x = mousePosition.x;
    let y = mousePosition.y;
    for (let i = 0; i < numberOfElements; i++) {
        if ((x >= point[i].x && x < point[i].x+ TILE_WIDTH) &&
                (y >= point[i].y && y < point[i].y+ TILE_WIDTH)){
            indexOfClickedTile = i;
            break;
        }
    }
    return indexOfClickedTile;
}
function isValidClicked( clickedPosition, spacePosition, point) {
         let dx =  Math.abs(point[clickedPosition].x - point[spacePosition].x);
         let dy = Math.abs(point[clickedPosition].y-point[spacePosition].y);
         let dr = Math.sqrt(dx*dx+dy*dy);
        return dr ==TILE_WIDTH;
}
function isGameOver() {
    let count=0;
    for (let index = 0; index < numberOfTiles; index++) {
        if (currentPattern[index] != targetPattern[index])
            break;
        count++;
    }
    return count == numberOfTiles;
}
