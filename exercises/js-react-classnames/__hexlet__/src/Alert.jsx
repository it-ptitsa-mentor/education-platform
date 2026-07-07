// @ts-check

import cn from 'classnames'
import React from 'react'

// BEGIN (write your solution here)
export default class Alert extends React.Component {
  render() {
    const { text, type } = this.props
    const alertClasses = cn('alert', `alert-${type}`)

    return (
      <div className={alertClasses} role="alert">
        {text}
      </div>
    )
  }
}
// END
