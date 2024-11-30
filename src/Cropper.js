// A draggable component for cropping a client's image

import React, {useState} from 'react'
import './Cropper.css'
import { useDispatch, useSelector } from 'react-redux'
import { setMouseIsDown, setMouseStartPoint, setPosition } from './redux/cropActions'

const Cropper = () => {

    const dispatch = useDispatch();
    const mouseIsDown = useSelector((state) => state.cropper.mouseIsDown);
    const mouseStartPoint = useSelector((state) => state.cropper.mouseStartPoint);
    const position = useSelector((state) => state.cropper.position);

    const handleMouseDown = (e) => {
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