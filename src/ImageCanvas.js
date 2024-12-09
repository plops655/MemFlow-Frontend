import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, useRef } from 'react-redux'
import { Seekbar } from './react-seekbar'
import axios from './axios'

const ImageCanvas = () => {

    const IMAGE_GET_URL = ""

    /* Index of current image in frames */
    const [imageIdx, setImageIdx] = useState(0)
    /* imageUrl to the image at imageIdx of frames */
    const [imageUrl, setImageUrl] = useState(null)
    /* Number of images */
    const [numImages, setNumImages] = useState(0)

    
    /* cachePromise is non-null if cacheRef is being asynchronously updated after call to loadImage */
    let cachePromise = null

    /* Size of cache partition. Third of total cache size */
    CACHE_PARTITION_SIZE = 5

    /* Size of cache */
    CACHE_SIZE = 3 * CACHE_PARTITION_SIZE

    /* cachedIdxs are the start idxs (0 mod CACHE_PARTITION_SIZE) of sets of CACHE_PARTITION_SIZE cached from the frames */
    /* For initial state -CACHE_PARTITION_SIZE, frames -CACHE_PARTITION_SIZE -> 2 * CACHE_PARTITION_SIZE - 1 are cached. 
       Entries for frames -CACHE_PARTITION_SIZE -> -1 are blank */
    let firstCachedIdx = -5
    
    /* Is the idx of the last image which is cached */
    let lastCachedIdx = 9

    /* cacheRef is cache storing set of CACHE_PARTITION_SIZE frames */
    const cacheRef = useRef(new Array(CACHE_SIZE))
    const canvasRef = useRef(null)
    const user = useSelector(state => state.user)

    /* The username of the user whose canvas we are displaying images to */
    const username = user.name

    /* Function which waits for cacheRef to update after new loadImage */
    const resolveCachePromise = async(timeout = 500) => {
        if (!cachePromise) {
            cachePromise = new Promise(async (resolve) => {
                await new Promise(resolve => setTimeout(resolve, timeout))
                resolve()
                cachePromise = null
            })
        }
        return cachePromise
    }

    /* Loads images from cachedIdx to cachedIdx + CACHE_SIZE - 1 upon reload (accounting for index overflow) */
    /* Logic done in async loadImagesOnBoot function */
    useEffect(() => {
        if (imageUrl == null) {
            return
        }
        const loadImagesOnBoot = async() => {
            let j;
            for (let i = 0; i < CACHE_SIZE; i += 1) {
                if (i >= numImages) {
                    continue
                }
                j = i + firstCachedIdx
                if (j >= 0) {
                    cacheRef.current[i] = await loadImage(j);
                }
            }
        }
    }, [imageUrl])

    /* 
       Fix so that input is shift of new cache idx relative to past cache idx and then find overlaps. 
    */
    async function updateCacheRefWithShift(shift) {
        const temp = firstCachedIdx
        if (shift >= 0) {
            firstCachedIdx = Math.min(Math.max(firstCachedIdx + shift, 0), numImages - 1)
            if (shift < CACHE_SIZE) {
                cacheRef.current.splice(0, CACHE_SIZE - shift, cacheRef.current.slice(shift, CACHE_SIZE))
                lastCachedIdx = temp + CACHE_SIZE - 1
                for (let i = 0; i < shift; i += 1) {
                    const idx = temp + i + CACHE_SIZE 
                    cacheRef.current[CACHE_SIZE - shift + i] = await loadImage(idx)
                    lastCachedIdx = idx
                }
                cacheRef.current.splice(-shift, shift, newEnd)
            } else {
                for (let i = 0; i < CACHE_PARTITION_SIZE; i += 1) {
                    const idx = temp + i + shift
                    cacheRef.current[i] = await loadImage(idx)
                    lastCachedIdx = idx
                }
            }
        } else {
            if (shift > -CACHE_SIZE) {
                cacheRef.current.splice(-1 * shift, CACHE_SIZE + shift, cacheRef.current.slice(0, CACHE_SIZE + shift))
                lastCachedIdx = temp + CACHE_SIZE + shift - 1
                for (let i = -1; i >= shift; i -= 1) {
                    if (idx < 0) {
                        // TODO: set preceding elements all to null
                    }
                    let idx = temp + i
                    cacheRef.current[i - shift] = await loadImage(idx)
                    firstCachedIdx = idx
                }
            } else {
                for (let i = shift + CACHE_SIZE - 1; i >= 0; i -= 1) {
                    let idx = temp + i
                    if (idx < 0) {
                        // TODO: set preceding elements all to null
                    }
                    cacheRef.current[i - shift] = await loadImage(idx)
                    firstCachedIdx = idx
                    if (i == shift + CACHE_SIZE - 1) {
                        lastCachedIdx = idx
                    }
                }
            }
        }
    }

    /* Asynchronously updates cacheRef */
    const updateCacheRef = async() => {
        await updateCacheRefWithShift(imageIdx - firstCachedIdx)
    }

    /* Left arrow corresponds to choosing frames with lower imageIdxs */
    const pressLeft = async(e) => {
        /* If current image is first frame, do nothing */
        if (imageIdx === 0) {
            return
        }
        setImageIdx(imageIdx - 1)
        /* We assume that users can only transition to neighboring frames */

        /* cacheIdx is idx of leftmost frame in cacheRef */

        /* If not loading and image in cachedRef */
        if (!loading && firstCachedIdx <= imageIdx && imageIdx < firstCachedIdx + 15) {
            setImageUrl(cacheRef.current[imageIdx - firstCachedIdx])
          /* If image not in cacheRef */  
        } else {
            /* Get from backend */
            const loadImageUrl = await loadImage(imageIdx)
            setImageUrl(loadImageUrl)
        }

        /* Asynchronously update cache and set load to true */
        if (imageIdx < firstCachedIdx || imageIdx >= firstCachedIdx + 5) {
            setLoading(true)

        }
    }
    /* Right arrow corresponds to choosing frames with higher imageIdxs */
    const pressRight = (e) => {

    }

    /* Get the image at idx from cache or fetch from server and reload cache.
       Note idx is not necessarily imageIdx, as in the useEffect at ln 25 */
    const loadImage = async(idx) => {
        if (idx < 0) {
            if (cachePromise == null) {
                await axios.get(idxToUrl(), {
                    responseType:'blob'
                })
                .then((response) => {
                    const imageBlobUrl = URL.createObjectURL(response.data)
                    setImageUrl(imageBlobUrl)
                }).catch((error) => {
                    console.error('Error fetching image:', error);
                })
            }
        }

        const idxToUrl = () => {
            return IMAGE_GET_URL + `//${idx}`
        }

        if (idx >= firstCachedIdx && idx <= lastCachedIdx) {
            const idxInCache = idx - firstCachedIdx
            setImageUrl(cacheRef.current[idxInCache])
            
        } else if (cachePromise == null) {
            await axios.get(idxToUrl(), {
                responseType:'blob'
            })
            .then((response) => {
                const imageBlobUrl = URL.createObjectURL(response.data)
                setImageUrl(imageBlobUrl)
            }).catch((error) => {
                console.error('Error fetching image:', error);
            })
        }
    }

  return (
    <div>
        {}
    </div>
  )
}

export default ImageCanvas