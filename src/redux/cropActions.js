export const SET_MOUSE_IS_DOWN = "SET_MOUSE_IS_DOWN";
export const SET_CROP_BOX_DIMS = "SET_CROP_BOX_DIMS";
export const SET_MOUSE_START = "SET_MOUSE_START";
export const SET_CROPPER_POSITION = "SET_CROPPER_POSITION";

export const setMouseIsDown = (mouseIsDown) => ({
    type: SET_MOUSE_IS_DOWN,
    payload: mouseIsDown,
});

export const setCropDims = (cropDims) => ({
    type: SET_CROP_BOX_DIMS,
    payload: cropDims,
});

export const setMouseStartPoint = (mouseStart)=> ({
    type: SET_MOUSE_START,
    payload: mouseStart,
});

export const setPosition = (cropperPos) => ({
    type: SET_CROPPER_POSITION,
    payload: cropperPos,
});