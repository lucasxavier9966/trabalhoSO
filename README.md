# Multithreading in Node.js

> On Node.js version 13, a new module called worker threads is there to
> implement multithreading.

In the index.js (**main thread**) we will use two routes and a function that returns the cumulative sum up to the limit value given as an argument.

    const getSum = (limit) => { 
    let sum = 0; 
    for (let i = 0; i < limit; i++) { sum += i; } 
    return sum; 
    };
    
    app.get("/", (req, res) => {  
    res.send("Process function on main thread.");  
    });
    
    app.get("/seprate-thread", (req, res) => {  
    res.send("Process function on seprate thread.");  
    });
And then we import the worker thread module to the main thread, and create another file **seprateThread.js** for defining the function getSum to run on another thread 

    const { Worker } = require("worker_threads");
 
To create an instance of the worker thread module and provide the pathname to the newly created file, it will be like that.

     const seprateThread = new Worker(__dirname + "/seprateThread.js");
To start the new thread 

    seprateThread.on("message", (result) => {  
    res.send(`Processed function getSum on seprate thread: ${result}`);  
    });
To send data to the new thread

    seprateThread.postMessage(1000);

`parentPort.postMessage()` used by the child thread (**seprateThread.js**) to communicate with the main thread. The below figure illustrates the communication between the child and the main thread.


 

- Source : https://medium.com/javascript-in-plain-english/how-to-do-multithreading-with-node-js-207aabdaddfb