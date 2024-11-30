import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, useRef } from 'react-redux'
import { Seekbar } from './react-seekbar'
import axios from './axios'

const ImageCanvas = () => {

    /* Index of current image in frames */
    const [imageIdx, setImageIdx] = useState(0)
    /* imageUrl to the image at imageIdx of frames */
    const [imageUrl, setImageUrl] = useState(null)
    /* Number of images */
    const [numImages, setNumImages] = useState(0)
    /* Loading is true if cacheRef is being asynchronously updated after call to loadImage */
    const [loading, setLoading] = useState(false)
    /* cachedIdxs are the start idxs (0 mod 5) of sets of 5 cached from the frames */
    /* For initial state -5, frames -5 -> 9 are cached. Entries for frames -5 -> -1 are blank */
    const [cachedIdx, setCachedIdx] = useState(-5)
    /* updatedCachedIdx is null when cacheRef not updating, and new cacheIdx when cacheRef is updating */
    const [updatedCachedIdx, setUpdatedCachedIdx] = useState(null)
    /* cacheRef is cache storing set of 5 frames */
    const cacheRef = useRef(new Array(15))
    const canvasRef = useRef(null)
    const user = useSelector(state => state.user)

    /* The username of the user whose canvas we are displaying images to */
    const username = user.name

    /* Function which waits for cacheRef to update after new loadImage */
    const waitingForCacheUpdate = async() => {
        while (!loading) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    /* Loads images from cachedIdx to cachedIdx + 14 upon reload (accounting for index overflow) */
    /* Logic done in async loadImagesOnBoot function */
    useEffect(() => {
        if (imageUrl == null) {
            return
        }
        const loadImagesOnBoot = async() => {
            let j;
            for (let i = 0; i < 15; i += 1) {
                if (i >= numImages) {
                    continue
                }
                j = i + cachedIdx
                if (j >= 0) {
                    cacheRef.current[i] = await loadImage(j);
                }
            }
        }
    }, [imageUrl])

    async function updateCacheRefWithOverlap(overlap) {
        setCachedIdx(cachedIdx - 15 + overlap)
        const first = cacheRef.current(0, overlap)
        cacheRef.current.splice(-overlap, overlap, first)
        let j;
        for (let i = 0; i < 15 - overlap; i += 1) {
            j = i + cachedIdx
            const image = await loadImage(j)
            if (image == null) {
                break
            }
        }
    }

    /* Asynchronously updates cacheRef */
    const updateCacheRef = async() => {
        /* If image left of cache */
        if (imageIdx < cachedIdx) {
            await updateCacheRefWithOverlap(5);
          /* If image in first trifecta of cacheRef */  
        } else if (imageIdx < cachedIdx + 5) {
            return
          /* If image in second trifecta of cacheRef */
        } else if (imageIdx < cachedIdx + 10) {
            await 
          /* If image in third trifecta of cacheRef */  
        } else if (imageIdx < cachedIdx + 15) {
          
          /* If image right of cache */  
        } else {

        }
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
        if (!loading && cachedIdx <= imageIdx && imageIdx < cachedIdx + 15) {
            setImageUrl(cacheRef.current[imageIdx - cachedIdx])
          /* If image not in cacheRef */  
        } else {
            /* Get from backend */
            const loadImageUrl = await loadImage(imageIdx)
            setImageUrl(loadImageUrl)
        }

        /* Asynchronously update cache and set load to true */
        if (imageIdx < cachedIdx || imageIdx >= cachedIdx + 5) {
            setLoading(true)

        }
    }
    /* Right arrow corresponds to choosing frames with higher imageIdxs */
    const pressRight = (e) => {

    }

    /* Get the image at idx from cache or fetch from server and reload cache.
       Note idx is not necessarily imageIdx, as in the useEffect at ln 25 */
    const loadImage = async(idx) => {

    }

  return (
    <div>

    </div>
  )
}

export default ImageCanvas