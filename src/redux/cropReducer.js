import { SET_MOUSE_IS_DOWN, SET_MOUSE_START, SET_CROPPER_POSITION, SET_CROP_BOX_DIMS } from "./cropActions"

/* The inital state where the mouse is not pressed down, the position of the lowerLeft corner and upperRight corner are (0,0) */
const initialState = {
    mouseIsDown: false,
    mouseStart: {x:0, y:0},
    cropperPos: {x:0, y:0},
    cropDims: {width: 0, height: 0},
}

const cropReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_MOUSE_IS_DOWN:
            return {
                ...state,
                mouseIsDown: action.payload,
            };
        case SET_CROP_BOX_DIMS:
            return {
                ...state,
                cropDims: action.payload,
            }
        case SET_MOUSE_START:
            return {
                ...state,
                mouseStart: action.payload,
            };
        case SET_CROPPER_POSITION:
            return {
                ...state,
                cropperPos: action.payload,
            };
        default:
            return state;
    }
}

export default cropReducer;