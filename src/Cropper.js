// A draggable component for cropping a client's image

import React, {useState} from 'react'
import './Cropper.css'
import { useDispatch, useSelector } from 'react-redux'
import { setMouseIsDown, setMouseStartPoint, setPosition } from './redux/cropActions'

const Cropper = (imgDims) => {

    const dispatch = useDispatch();
    const mouseIsDown = useSelector((state) => state.cropper.mouseIsDown);
    const mouseStartPoint = useSelector((state) => state.cropper.topLeft);
    const position = useSelector((state) => state.cropper.lowerRight);

    const handleMouseDown = (e) => {
        const img = e.target.closest("div").querySelector("img");
        const rect = img.getBoundingClientRect();

        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        if (relativeX < 0 || relativeX >= imgDims.width || relativeY < 0 || relativeY >= imgDims.height) {
          return;
        }

        dispatch(setMouseIsDown(true));
        dispatch(setMouseStartPoint({x: e.clientX, y: e.clientY}));
    }

    const handleMouseUp = () => {
      dispatch(setMouseIsDown(false));
    }

    const handleMouseMove = (e) => {
      if (!mouseIsDown) { return; }
      dx = e.clientX - mouseStartPoint.x;
      dy = e.clientY - mouseStartPoint.y;
      const newPosition = {x: position + dx, y: position + dy};
      dispatch(setMouseStartPoint({x: e.clientX, y: e.clientY}));
      dispatch(setPosition(newPosition));
    }

  return (
    <div>
        <div className="cropper" 
        onMouseDown={handleMouseDown} 
        onMouseUp={handleMouseUp} 
        onMouseMove={handleMouseMove}
        style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
        }}/>
    </div>
  )
}

export default Cropper