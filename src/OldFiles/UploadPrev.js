import React, { useEffect, useRef, useState } from 'react';
import axios from '../axios';
import { useSelector } from 'react-redux';

const Upload = () => {

    const [img_dir, setImgDir] = useState("");
    const [files, setFiles] = useState([]);
    const [uid, setUid] = useState("");
    const [modelIsEvaluated, setModelIsEvaluated] = useState(false);
    const [numberOfImages, setNumberOfImages] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [imageCache, setImageCache] = useState({});
    // currentImageIdx is 0-indexed
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    const position = useSelector((state) => state.cropper.position);
    const x = position.x
    const y = position.y

    const cacheRef = useRef(imageCache);

    useEffect(() => {
        console.log("uid changed to " + uid);
    }, [uid])

    useEffect(() => {
        const loadImages = async () => {
            await handleImageLoad(currentImageIdx);
            await handleImagePrefetch(currentImageIdx);
        };
        if (modelIsEvaluated) {
            loadImages();
        }
    }, [currentImageIdx])

    useEffect(() => {
        const handleKeyPressed = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    if (currentImageIdx + 1 < numberOfImages) {
                        setCurrentImageIdx(currentImageIdx + 1);
                    }
                case "ArrowDown":
                    if (currentImageIdx - 1 >= 0) {
                        setCurrentImageIdx(currentImageIdx - 1);
                    }
            }
        }

        if (modelIsEvaluated) {
            window.addEventListener('keydown', handleKeyPressed);

            return () => {
                window.removeEventListener('keydown', handleKeyPressed);
            }
        }
    }, [])

    const handleImageLoad = async (imageIdx) => {

        // API call to get desired image
        try { 

            const getImageResponse = await axios.get(`/getImage/${uid}/${imageIdx}`, {
                responseType: 'blob',
            });

            const status = getImageResponse.status;

            if (status === 404) {
                console.log(getImageResponse.data.error);
            }

            const blob_url = URL.createObjectURL(getImageResponse.data);

            if (cacheRef.current[currentImageIdx]) {
                setImageCache({
                    ...imageCache,
                    [currentImageIdx]: {
                        ...imageCache[currentImageIdx],
                        timeStamp: Math.floor(Date.now() / 1000),
                    }
                })
            } else {
                setImageCache({
                    ...imageCache,
                    [currentImageIdx]: {
                        image_blob_url: blob_url,
                        timeStamp: Math.floor(Date.now() / 1000),
                    }
                })
            }

            setIsLoading(false);

        } catch (error) {
            console.log(error);
        }
    }

    const handleImagePrefetch = async (imageIdx) => {

        for (let i = 0; i < 5; i += 1) {
            const idx = imageIdx - i;
            if (idx < 0) {
                return;
            }
            try {
                await handleImageLoad(idx);
            } catch (error) {
                console.log(error);
            }
        }

        for (let i = 0; i < 5; i += 1) {
            const idx = imageIdx + i;
            try {
                await handleImageLoad(idx);
            } catch (error) {
                console.log(error);
            }
        }

    }
    

    const handleChange = (e) => {
        const file = e.target.files;
        if (file.length > 0) {
            const file0 = file[0];
            const dir = file0.webkitRelativePath.split("/")[0];
            setImgDir(dir);
        }
        setFiles([...file]);
    }

    const handleUpload = async () => {
        const form_data = new FormData();

        form_data.append('img_dir', img_dir);
        for (const file of files) {
            form_data.append('files', file, file.name);
        }

        try {
            const response = await axios.post("/upload", {});
            if (response.status === 200) {
                const newUid = response.data.success;
                setUid(newUid);
                form_data.append('uid', newUid);
                try {
                    const response = await axios.post("/upload/images", form_data, {"headers": {"Content-type": "multipart/form-data"}});
                    if (response.status != 200) {
                        console.log("Failed to properly upload image files to server");
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("Failed to properly upload images");
            }
        } catch (error) {
            console.log(error);
        }
    } 

    const handleDisplayFlow = () => {
        // send API call to check if images with specified uid have already been uploaded
        axios.get(`/isEvaluated/${uid}`).then(response => {
            if (response.status === 200) {
                setModelIsEvaluated(true);
            }
        }).catch(error => {
            setModelIsEvaluated(false);
            console.log(error);
        })
        
        if (!modelIsEvaluated) {
            handleEvaluate();
        }

    }

    const handleEvaluate = () => {

        const model_data = {
            "uid": uid,
            "top": y,
            "left": x,
        }

        axios.post("/evalModel", model_data, {
            "headers": {"Content-type": "application/json"}
        }).then(response => {
            console.log(response.data.success);
            console.log(response.status);
            if (response.status === 200) {
                setModelIsEvaluated(true);
            }
        }).catch(error => {
            console.log(error);
        })

        if (modelIsEvaluated) {
            axios.get(`/getNumberOfImages/${uid}`).then(response => {
                setNumberOfImages(response.numberOfImages);
            }).catch(error => {
                console.log(error);
            })
        }
    }

  return (
    <div>
        <input type="file" name="files" multiple webkitdirectory="" onChange={handleChange} />
        <button onClick={handleUpload}>Upload Files</button>
        <button onClick={handleDisplayFlow}>Show Optical Flow</button>

        {isLoading ? (
            <p>Loading File</p>
        ) : (
            <img src={cacheRef.current[currentImageIdx]} alt="Image Unavailable"></img>
        )}
    </div>
  )
}

export default Upload