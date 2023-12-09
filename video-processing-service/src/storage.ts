//1. do all google cloud storage interactions
//2. Keep track of all the local file interactions
// this is like our local storage layer

import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg" //wrap for fluent-ffmpeg which is a CLI tool  
import exp from "constants";
import { resolve } from "path";
import { rejects } from "assert";
import { dir } from "console";


//instance to allow us to interact with the GCS api
const storage = new Storage();

const rawVideoBucketName = 'volan-yt-raw-videos' //where peoople uplodad videos
const processedVideoBucketName = "volan-yt-processed-videos" //where processed videos are uploaded after services is done processing

const localRawVideoPath = './raw-videos' //raw videos will be placed in this folder in our loacl file system
const localProcessedVideoPath = './processed-videos' // processed videos will be placed in this folder in our local file system

/**
 * Creates local directories for the raw and processed videos
 */
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath)
    ensureDirectoryExistence(localProcessedVideoPath)
}

/**
 * @param rawVideoName The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted
 */

export function convertVideo(rawVideoName: string, processedVideoName: string) {

    //returning a promise will let us know when the video is done being processed
    //or if there was an error
    //we can resove or reject the promise at run time
    return new Promise<void>((resolve, reject) => {

        //converting video
        //-vf says we are working with a video 
        //scale=-1:360, means we want to convert it to 360P
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`).outputOption('-vf', 'scale=-1:360')
            .on("end", () => {
                //these are events
                //this is the "end" even 

                console.log("Processing finished sucessfully.")
                resolve();
            })
            .on("error", (err) => {
                //this is the "error" event 
                console.log(`An Error occured: ${err.message}`);
                //500 - internal server error
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`)

    })
}

/**
 * @param fileName - The name of the file to downlaod from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder. 
 * @returns A promise that resolves when the file has been downloaded
 */

export async function downlaodRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}` })

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    )
}


/**
 * 
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}
 * @returns A promise that resolves when the file has been uploaded
 */

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    })

    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );

    //make it public so people can view it
    await bucket.file(fileName).makePublic();

}


/**
 * @param fileName The name of the file to delete from 
 * {@link localRawVideoPath} folder. 
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`)
}

/**
 * @param fileName The name of the file to delete from 
 * {@link localProcessedVideoPath} folder. 
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`)
}


/**
 * @param filePath - The path of the file to delete
 * @returns A promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err)
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`)
                    resolve();
                }
            })
        }
        else {
            console.log(`File not found at ${filePath}, skipping the delete.`)
            resolve()
        }
    });
}


/**
 * Ensures a directory exists, createing it if necessary. 
 * @param {string} dirPath - The directory path to check
 * 
 */

function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); //recursive:true enables creating nested directories
        console.log(`Dirctory created at ${dirPath}`)
    }
}