export const SET_MOUSE_IS_DOWN = "SET_MOUSE_IS_DOWN";
export const SET_MOUSE_LOWER_LEFT = "SET_MOUSE_LOWER_LEFT";
export const SET_MOUSE_UPPER_RIGHT = "SET_MOUSE_UPPER_RIGHT";

export const setMouseIsDown = (mouseIsDown) => ({
    type: SET_MOUSE_IS_DOWN,
    payload: mouseIsDown,
});

export const setMouseStartPoint = (mouse_lower_left)=> ({
    type: SET_MOUSE_LOWER_LEFT,
    payload: mouse_lower_left,
});

export const setPosition = (mouse_upper_right) => ({
    type: SET_MOUSE_UPPER_RIGHT,
    payload: mouse_upper_right,
});