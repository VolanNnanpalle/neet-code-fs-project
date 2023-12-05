import express from "express"

const app = express()
const port = 3000

app.get("/",(req, res) =>{
    res.send("Hello World");
});


//start server
app.listen(port, ()=>{
    //for logging 
    console.log(`Video processing service listening at http://localhost:${port}`);

});