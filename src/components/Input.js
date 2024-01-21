import React, { useRef } from 'react'

const Input = (props) => {


  let iconRef = useRef(null)
  function scaleInIcon() {
    iconRef.current.classList.add('scale-125');
  }
  function scaleOutIcon() {
    iconRef.current.classList.remove('scale-125');
  }

  return (
    <div>
      <div className='flex'>
        <span className={`bg-amber-900 text-white p-3 rounded-lg text-xs duration-200`} ref={iconRef}>{props.icon}</span>
        <input
          type={props.type}
          placeholder={props.placeholder}
          className='pl-3 sm:pl-4 text-sm sm:text-base rounded-r-lg outline-none w-full bg-gray-100 text-amber-900'
          defaultValue={props.defaultValue}
          {...props.register(`${props.name}`, {
            required: props.message,
            minLength: {
              value: props.minimumLength | props.minimumChars,
              message: `Should be of ${props.minimumLength ? props.minimumLength + ' numbers' : props.minimumChars + ' characters'} atleast!`
            },
            maxLength: {
              value: props.length,
              message: `Phone Number should be of ${props.length} Numbers only!`
            },
            pattern: {
              value: props.regEx,
              message: props.name === 'email' ? 'Should be in the form ...@gmail.com' : 'Should be between 1 and 100 only'
            }
          })}
          autoComplete='off'
          onFocus={scaleInIcon}
          onBlur={scaleOutIcon}
        />
      </div>
      {props.errMessage ? (
        <span name={props.name} className='h-5 mt-1 text-sm text-amber-900 block'>
          {props.errMessage}
        </span>
      ) : (
        <div className='h-5 mt-1'>&nbsp;</div>
      )}
    </div>
  )
}

export default Input