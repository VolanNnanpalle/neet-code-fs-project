import express from "express"
import ffmpgeg from "fluent-ffmpeg" //wrap for fluent-ffmpeg which is a CLI tool  

const app = express()

//for our express server to know we are using json
app.use(express.json())


app.post("/process-video",(req, res) =>{
    //get the path from input video file from request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;


    if (!inputFilePath || !outputFilePath){
        //400 is a client error 
        res.status(400).send("Bad Request: Missing file path")
    }

    //converting video
    //-vf says we are working with a video 
    //scale=-1:360, means we want to convert it to 360P
    ffmpgeg(inputFilePath).outputOption('-vf','scale=-1:360')
    .on("end",()=>{
    //these are events
    //this is the "end" even 

     res.status(200).send(`Processing finished sucessfully.`)
    })
    .on("error", (err) =>{
        //this is the "error" event 
        console.log(`An Error occured: ${err.message}`);
        //500 - internal server error
        res.status(500).send(`Internal Server Error: ${err.message}`)

    })
    .save(outputFilePath)

    
});

//standard technique
const port = process.env.PORT || 3000;
//start server
app.listen(port, ()=>{
    //for logging 
    console.log(`Video processing service listening at http://localhost:${port}`);

});