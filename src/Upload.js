import React, { useState, useRef } from 'react'
import axios from './axios'
import { useSelector } from 'react-redux'

/*
    Uploads new images
*/
const Upload = ({ encryptedUserURI }) => {

    /* The url to post files to upload */
    const upload_url = ""

    /* files are the set of files the user chooses to upload */
    const [files, setFiles] = useState([])

    /* A reference to a file input for choosing files */
    const fileInputRef = useRef(null)

    const uploadButtonPress = () => {
        /* Click invisible input to choose files */
        fileInputRef.current.click()
    }

    const chooseFiles = (e) => {
        /* Set chosen files to files array */
        setFiles(Array.from(e.target.files))
    }

    const uploadImages = async (e) => {
        /* This function sends a post request to the Flask backend and uploads the images */

        /* Choose files to upload */
        uploadButtonPress()

        /* 
           Initialize a FormData object for storing the uploaded files to.
           FormData stores key-value pairs corresponding to form fields, folders, and files.
        */
        const form_data = new FormData();

        /* Append each file in files to form_data */
        for (const file of files) {
            form_data.append('files', file, file.name);
        }

        try {
            const response = await axios.post(upload_url, form_data);
            if (response.status != 200) {
                console.log("Failed to upload data");
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        <button onClick={uploadImages}>Upload Images</button>
        <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={chooseFiles}/>
    </div>
  )
}

export default Upload