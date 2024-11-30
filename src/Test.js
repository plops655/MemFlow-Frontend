import React from 'react'
import axios from './axios';

const Test = () => {
    const sendAxios = () => {
        axios.get("test").then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }
  return (
    <div>
        <input onClick={sendAxios} type="text" />
    </div>
  )
}

export default Test