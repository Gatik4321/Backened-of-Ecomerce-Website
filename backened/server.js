const app = require('./app');

const dotenv = require("dotenv");
const connectDatabase=require('./config/database');
//handling uncaught exception that is basically used to handle unitialized variables our code
process.on("uncaughtException",(err)=>{
     console.log(`Error: ${err.message}`);
     console.log("Shutting down  the server due to unhandled promise rejection")
     process.exit(1);
})

dotenv.config({path:"backened/config/config.env"})

//connecto daat basr
connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

app.get("/",()=>{
    console.log("hello my name is gatik");
})


// Unhandled promise rejection
// if we have written our mongo db server name incorrect than this is used
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down the server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    });
})