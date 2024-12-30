import { SET_VECTOR_DENSITY } from "./vectorDensityActions"

/* The inital state where the mouse is not pressed down, the position of the lowerLeft corner and upperRight corner are (0,0) */
const initialState = {
    density: 1,
}

const vectorDensityReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_NAME:
            return {
                ...state,
                density: action.payload,
            };
        default:
            return state;
    }
}

export default vectorDensityReducer;