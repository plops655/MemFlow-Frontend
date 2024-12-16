import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, useRef } from 'react-redux'
import { Seekbar } from './react-seekbar'
import axios from './axios'

const ImageCanvas = () => {

    const IMAGE_GET_URL = "";

    /* Index of current image in frames */
    const [imageIdx, setImageIdx] = useState(0);
    /* imageRef is the actual image we display onto a canvas */
    const imageRef = useRef(null);
    /* Number of images */
    const [numImages, setNumImages] = useState(0);

    /* Size of cache partition. Third of total cache size */
    CACHE_PARTITION_SIZE = 5;
    /* Size of cache */
    CACHE_SIZE = 3 * CACHE_PARTITION_SIZE;
    /* cachedIdxs are the start idxs (0 mod CACHE_PARTITION_SIZE) of sets of CACHE_PARTITION_SIZE cached from the frames */
    /* For initial state -CACHE_PARTITION_SIZE, frames -CACHE_PARTITION_SIZE -> 2 * CACHE_PARTITION_SIZE - 1 are cached. 
       Entries for frames -CACHE_PARTITION_SIZE -> -1 are blank */
    let FIRST_CACHED_IMG_IDX = -1 * CACHE_PARTITION_SIZE;
    /* Is the idx of the last image which is cached */
    let FINAL_CACHED_IMG_IDX = CACHE_PARTITION_SIZE * 2 - 1;

    /* cacheRef is cache storing set of CACHE_PARTITION_SIZE frames */
    const cacheRef = useRef(new Array(CACHE_SIZE));
    const user = useSelector(state => state.user);
    const username = user.name;

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message || "Assertion failed");
        }
    }

    const handleKeyDown = async(event) => {
        if (event.key === 'ArrowLeft') {
            await pressLeft();
        } else if (event.key == 'ArrowRight') {
            await pressRight();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [])

    const updateCacheRef = async() => {
        const shift = imageIdx - FIRST_CACHED_IMG_IDX;
        const temp = FIRST_CACHED_IMG_IDX
        if (shift >= 0) {
            /* The only possibility is shift === CACHE_SIZE */
            assert(shift === CACHE_SIZE, "shift must be CACHE_SIZE if non-negative");
            cacheRef.current.splice(0, CACHE_PARTITION_SIZE, cacheRef.current.slice(-CACHE_PARTITION_SIZE, CACHE_SIZE));
            for (let i = 0; i < CACHE_SIZE - CACHE_PARTITION_SIZE; i += 1) {
                const idx = FINAL_CACHED_IMG_IDX + i + 1;
                cacheRef.current[CACHE_PARTITION_SIZE + i] = await getImgAtIdx(idx);
            }
            FIRST_CACHED_IMG_IDX += (CACHE_SIZE - CACHE_PARTITION_SIZE);
            FINAL_CACHED_IMG_IDX += (CACHE_SIZE - CACHE_PARTITION_SIZE);
        } else {
            /* The only possibility is shift === -1 */
            assert(shift === -1, "shift must be -1 if negative");
            cacheRef.current.splice(-CACHE_PARTITION_SIZE, CACHE_PARTITION_SIZE, cacheRef.current.slice(0, CACHE_PARTITION_SIZE));
            for (let i = 0; i < CACHE_SIZE - CACHE_PARTITION_SIZE; i += 1) {
                const idx = FIRST_CACHED_IMG_IDX - CACHE_SIZE + CACHE_PARTITION_SIZE + i;
                cacheRef.current[i] = await getImgAtIdx(idx);
            }
            FIRST_CACHED_IMG_IDX -= (CACHE_SIZE + CACHE_PARTITION_SIZ);
            FINAL_CACHED_IMG_IDX -= (CACHE_SIZE + CACHE_PARTITION_SIZE);
        }
        FIRST_CACHED_IMG_IDX = Math.max(FIRST_CACHED_IMG_IDX, 0);
        FINAL_CACHED_IMG_IDX = Math.min(FINAL_CACHED_IMG_IDX, numImages);
    }

    const setImg = (imageUrl) => {
        imageRef.current.src = imageUrl;
    }

    const updateCurrentImg = () => {
        assert(imageIdx >= FIRST_CACHED_IMG_IDX && imageIdx <= FINAL_CACHED_IMG_IDX, "Current image must be within bounds of cacheRef window");
        setImg(cacheRef.current[imageIdx - FIRST_CACHED_IMG_IDX]);
    }

    const pressLeft = async() => {
        if (imageIdx != 0) {
            setImageIdx(imageIdx - 1);
            if (FIRST_CACHED_IMG_IDX <= imageIdx && FINAL_CACHED_IMG_IDX >= imageIdx) {
                setImg(cacheRef.current[imageIdx - FIRST_CACHED_IMG_IDX]);
            } else {
                await updateCacheRef();
                updateCurrentImg();
            }
        }
    }

    const pressRight = async() => {
        if (imageIdx != numImages - 1) {
            setImageIdx(imageIdx + 1);
            if (FIRST_CACHED_IMG_IDX <= imageIdx && FINAL_CACHED_IMG_IDX >= imageIdx) {
                setImg(cacheRef.current[imageIdx - FIRST_CACHED_IMG_IDX]);
            } else {
                await updateCacheRef();
                updateCurrentImg();
            }
        }
    }

    const getImgAtIdx = async(idx) => {

        if (idx < 0 || idx >= numImages) {
            return null;
        }

        const idxToUrl = () => {
            return IMAGE_GET_URL + `//${username}//${idx}`
        }

        if (idx >= FIRST_CACHED_IMG_IDX && idx <= FINAL_CACHED_IMG_IDX) {
            const idxInCache = idx - FIRST_CACHED_IMG_IDX
            return cacheRef.current[idxInCache]
        } else if (cachePromise == null) {
            const imageUrl = idxToUrl()
            await axios.get(imageUrl, {
                responseType:'blob'
            })
            .then((response) => {
                return URL.createObjectURL(response.data)
            }).catch((error) => {
                console.error('Error fetching image:', error);
            })
        }
        return null
    }

  return (
    <div>
        <img ref={imageRef} src={null}/>
    </div>
  )
}

export default ImageCanvas