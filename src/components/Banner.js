import React from 'react'

const Banner = (props) => {
  return (
    <div className={`${props.background} mx-auto flex justify-center align-middle my-0`}>
      <h1 className={`font-bold text-4xl md:text-6xl ${props.textColor} my-16`}>{props.text}</h1>
    </div>
  )
}

export default Banner