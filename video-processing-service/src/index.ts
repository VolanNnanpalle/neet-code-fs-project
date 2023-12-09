import express from "express"
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downlaodRawVideo, setupDirectories, uploadProcessedVideo } from "./storage"
import { measureMemory } from "vm";

setupDirectories();

const app = express()

//for our express server to know we are using json
app.use(express.json())


app.post("/process-video", async (req, res) => {
    //Get the bucket and file name fromteh cloud pub/sub message
    let data
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString("utf8")
        data = JSON.parse(message)
        if (!data.name) {
            throw new Error("Invalid message payload recieved")
        }

    } catch (error) {
        console.log(error)
        //400 - client error 
        return res.status(400).send('Bad Requests: missign filename. ')
    }

    const inputFileName = data.name
    const outputFileName = `processed-${inputFileName}`

    //download the raw video from cloud storage
    await downlaodRawVideo(inputFileName)

    //Convert the video to 360p

    try {

        await convertVideo(inputFileName, outputFileName)

    } catch (err) {
        //to await the in parallel 
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])

        console.log(err)
        return res.status(500).send(`Internal Server Error: video processing failed`)
    }

    //Upload the processed video to cloud storage
    await uploadProcessedVideo(outputFileName)

    //to await the in parallel 
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ])

    return res.status(200).send('Processing finished successfully')

});

//standard technique
const port = process.env.PORT || 3000;
//start server
app.listen(port, () => {
    //for logging 
    console.log(`Video processing service listening at http://localhost:${port}`);

});