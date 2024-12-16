import { SET_MOUSE_IS_DOWN, SET_MOUSE_LOWER_LEFT, SET_MOUSE_UPPER_RIGHT } from "./cropActions"

/* The inital state where the mouse is not pressed down, the position of the lowerLeft corner and upperRight corner are (0,0) */
const initialState = {
    mouseIsDown: false,
    topLeft: {x:0, y:0},
    lowerRight: {x:0, y:0},
}

const cropReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_MOUSE_IS_DOWN:
            return {
                ...state,
                mouseIsDown: action.payload,
            };
        case SET_MOUSE_LOWER_LEFT:
            return {
                ...state,
                topLeft: action.payload,
            };
        case SET_MOUSE_UPPER_RIGHT:
            return {
                ...state,
                lowerRight: action.payload,
            };
        default:
            return state;
    }
}

export default cropReducer;