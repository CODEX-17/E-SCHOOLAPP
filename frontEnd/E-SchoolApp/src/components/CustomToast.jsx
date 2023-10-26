import React from 'react'
import style from './CustomToast.module.css'

const CustomToast = ({ message }) => {

  return (
    <div style={style.container}>
        <p> {message} </p>
    </div>
  )
}

export default CustomToast
