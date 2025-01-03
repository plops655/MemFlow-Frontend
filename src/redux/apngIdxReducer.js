import { SET_APNG_IDX } from "./apngIdxActions"

/* The inital state where the mouse is not pressed down, the position of the lowerLeft corner and upperRight corner are (0,0) */
const initialState = {
    name: "",
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_APNG_IDX:
            return {
                ...state,
                name: action.payload,
            };
        default:
            return state;
    }
}

export default userReducer;