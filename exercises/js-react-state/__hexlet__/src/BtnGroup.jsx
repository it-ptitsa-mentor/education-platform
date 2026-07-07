// @ts-check

import cn from 'classnames'
import React from 'react'

// BEGIN (write your solution here)
export default class BtnGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {active: 'none'}
  }


  render() {
    return (
      <div className="btn-group" role="group">
        <button onClick={() => this.setState({active: 'left'})} type="button" className={cn('btn', 'btn-secondary', 'left', { active: this.state.active === 'left' })}>Left</button>
        <button onClick={() => this.setState({active: 'right'})} type="button" className={cn('btn', 'btn-secondary', 'left', { active: this.state.active === 'right' })}>Right</button>
      </div>
    )
  }
}
// END
