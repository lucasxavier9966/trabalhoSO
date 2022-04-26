/*
*  File Name: index.js
*  Description: This is the main thread
*/const { Worker } = require("worker_threads");
const mazegeneration = require("maze-generation");

const THREADS_AMOUNT = 2;
let canRun = true;

function getRandomInt(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min)) + min;
}

function right(position1, position2) {
     position2 = position2 + 1;
     return { position1, position2 }
}

function left(position1, position2) {
     position2 = position2 - 1;
     return { position1, position2 }
}

function down(position1, position2) {
     position1 = position1 + 1;
     return { position1, position2 }
}

function up(position1, position2) {
     position1 = position1 - 1;
     return { position1, position2 }
}


const options = {
     width: 10,
     height: 15,
     seed: 12345,
     algorithm: 'HUNTANDKILL'
}

// Generate a maze
const generatedMaze = mazegeneration(options);
const stringRepresentation = generatedMaze.toString();
console.log(stringRepresentation)

let JSONRepresentation = generatedMaze.toJSON();
JSONRepresentation.rows[0][0].cheese = true


let mouse1 = { position1: getRandomInt(0, 14), position2: getRandomInt(0, 9) }
let mouse2 = { position1: getRandomInt(0, 14), position2: getRandomInt(0, 9) }

let cheese = false;
let newPos = mouse1


JSONRepresentation.rows[mouse1.position1][mouse1.position2].mouse1 = true;
JSONRepresentation.rows[mouse1.position1][mouse1.position2].visitedmouse1 = true;
JSONRepresentation.rows[mouse2.position1][mouse2.position2].mouse2 = true;
JSONRepresentation.rows[mouse1.position1][mouse1.position2].visitedmouse2 = true;


(function () {
  // Array of promises
  const promises = [];
  for (let idx = 0; idx < THREADS_AMOUNT; idx += 1) {
    // Add promise in the array of promises
    promises.push(new Promise((resolve) => {
      const worker = new Worker('./seprateThread.js', { 
          workerData: { 
            workerId: idx 
          } 
        });


       
      worker.on("exit", () => {
        console.log('Fechando Thread')
        resolve()
      });
      
      worker.on("message", (value) => {
          while (cheese == false) {
               let mouseName = idx + 1
               newPos = huntingCheese(newPos, 'mouse' + mouseName)
               console.log(`O rato ${mouseName} está na posição ${newPos.position1} por ${newPos.position2} da matriz;`)

               if (JSONRepresentation.rows[newPos.position1][newPos.position2].cheese) {
                    cheese == true
                    console.log('O rato ' + mouseName + ' achou o queijo primeiro!')
                    process.exit(0)
               }
          }
          
      })
    }))
  }
  // Handle the resolution of all promises
  return Promise.all(promises);
})().then(() => {
  canRun = false;
})
// infinite loop




function huntingCheese(initialMousePosition, mouseName) {
     let position1 = initialMousePosition.position1;
     let position2 = initialMousePosition.position2;
     let newMousePosition
     let iterator = 1;
     let upIf = true;
     let downIf = true;
     let leftIf = true;
     let rightIf = true;
     let visitedMouse = 'visited' + mouseName

     while (iterator == 1) {
          if (!JSONRepresentation.rows[position1][position2].up && upIf) {
               console.log(`O rato ${mouseName} foi para cima;`)
               newMousePosition = up(position1, position2);

               if (JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] == null) {
                    JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] = true
                    iterator = 0
               } else {
                    upIf = false;
               }
               
          } else if (!JSONRepresentation.rows[position1][position2].left && leftIf) {
               console.log(`O rato ${mouseName} foi para esquerda;`)
               newMousePosition = left(position1, position2);


               if (JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] == null) {

                    JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] = true
                    iterator = 0
               } else {
                    leftIf = false;
               }
               
          } else if (!JSONRepresentation.rows[position1][position2].right && rightIf) {
               console.log(`O rato ${mouseName} foi para direita;`)
               newMousePosition = right(position1, position2);

               if (JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] == null) {
                    
                    JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] = true
                    iterator = 0
               } else {
                    rightIf = false;
               }
          } else if (!JSONRepresentation.rows[position1][position2].down && downIf) {
               console.log(`O rato ${mouseName} foi para baixo;`)
               newMousePosition = down(position1, position2);

               if (JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] == null) {
               
                    JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][visitedMouse] = true
                    iterator = 0
               } else {
                    downIf = false;
               }
               
          }

     }


     JSONRepresentation.rows[position1][position2][mouseName] = false
     JSONRepresentation.rows[newMousePosition.position1][newMousePosition.position2][mouseName] = true;

     return { position1: newMousePosition.position1, position2: newMousePosition.position2 }

}





























