// @ts-check

import IMask from 'imask'
import React, { useEffect, useRef } from 'react'

const MaskedInput = (props) => {
  // BEGIN (write your solution here)
  const { onAccept } = props
  const inputRef = useRef(null)

  useEffect(() => {
    const mask = IMask(inputRef.current, { mask: '+{7}(000)000-00-00' })
    mask.on('accept', () => onAccept(mask.value))
    return () => mask.destroy()
  }, [onAccept])

  return <input type="text" ref={inputRef} />
  // END
}

export default MaskedInput
