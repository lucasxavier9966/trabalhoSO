/*
*  File Name: seprateThread.js
*  Description: This is another thread
*/
const { parentPort, workerData } = require("worker_threads");

console.log(`THREAD ${workerData.workerId} iniciada` ); 

parentPort.postMessage(`ThreadId: ${workerData.workerId}`) 


parentPort.close();