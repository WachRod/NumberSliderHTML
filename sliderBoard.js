// sliderBoard.js
// date : 20 June 2020
const TILE_WIDTH = 60;
const MAXIMUM_NUMBER_OF_IMAGE =25;
var Super_Player=false;
var numberOfTilesPerRow = 3;
var numberOfTilesPerColumn = 3;
var Shuffling_Tile = false;
var Game_Completed = true;
var Vertical_Direction=false;
var Sound_Played=true;


var numberOfTiles;
var currentPattern = [];
var targetPattern=[];
var tileImages = [];
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
var chkSound = document.getElementById('chkSound');
var label = document.getElementById('boardSizeHeader');

var clappingSound;
var slidingSound;

window.onload = function() {
   createTiles();
slidingSound = new Audio("ballHit.mp3");
clappingSound = new Audio("clapping2.mp3");

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
   if (!Game_Completed) newGame();
} );
chkSound.addEventListener('change',function(event) {
    if (event.target.checked){
         Sound_Played=true;
    } else Sound_Played=false;    
  
} );
//if (document.querySelector('input[name="boardSize"]')) {
    document.querySelectorAll('input[name="boardSize"]').forEach(function(element){
      element.addEventListener("change", function(event) {
        numberOfTilesPerRow = event.target.value;
        numberOfTilesPerColumn=event.target.value;
        if (!Game_Completed)newGame();
      });
    });
    
 // }
// document.addEventListener('input',function(event) {

//     if(event.target.getAttribute('name')=="boardSize") {
//     numberOfTilesPerRow = event.target.value;
//     numberOfTilesPerColumn = numberOfTilesPerRow;
//     newGame();
//     }
// } );
board.addEventListener('click',function() {
    if (!Game_Completed) play();else alert("Clik 'New Game' for start playing");
});   

function play(){
    if  (!Game_Completed) {
    var indexOfClickedTile = getIndexOfClickedTile(coordinates,numberOfTiles,board,event);
    var indexOfEmptyTile = getIndexOfEmptyTile(currentPattern);
       if (isValidClicked(indexOfClickedTile,indexOfEmptyTile ,coordinates)|| Super_Player){
            currentPattern[indexOfEmptyTile] = currentPattern[indexOfClickedTile];
            currentPattern[indexOfClickedTile] = 0;
            if (Sound_Played) slidingSound.play();
            drawTiles();
            if (isGameOver())  {
				Game_Completed = true;
				var message = "Game Over"
                var x = (board.width - 25*message.length)/2;
                var y = board.height /2;
                if (numberOfTilesPerRow==3){
                    ctx.font="bold 30px Tahoma";
                    x=10;
                }   else  ctx.font= "bold 40px Tahoma";
                ctx.fillStyle= "blue";
                ctx.fillText("Game Over",x,y);
                if(Sound_Played) clappingSound.play();
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

function drawTiles() {
    for (let i =0; i < numberOfTiles; i++) {
        ctx.drawImage(tileImages[currentPattern[i]], coordinates[i].x, coordinates[i].y);
    }
}
function newGame(){
    Game_Completed = false;
   // movingCount = 0;
   numberOfTiles = numberOfTilesPerRow*numberOfTilesPerColumn;
   board.width = numberOfTilesPerColumn*TILE_WIDTH;
   board.height = numberOfTilesPerRow*TILE_WIDTH;
 //  createTiles();
    currentPattern = setDefaultStartingPositon(numberOfTiles);
    targetPattern = designTargetPattern(numberOfTiles);
    coordinates = computeCoordinate();
    drawTiles();
    
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