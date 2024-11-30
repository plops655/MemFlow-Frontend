import { configureStore, combineReducers } from '@reduxjs/toolkit'
import apngIdxReducer from './apngIdxReducer'
import userReducer from './userReducer'
import cropReducer from './cropReducer'
import vectorDensityReducer from './vectorDensityReducer'

const reducer = combineReducers({
    apngIdx: apngIdxReducer,
    user: userReducer,
    crop: cropReducer,
    vectorDensity: vectorDensityReducer,
})

const store = configureStore({
    reducer,
});

export default store;
