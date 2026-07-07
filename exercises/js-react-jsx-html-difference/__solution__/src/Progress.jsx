// @ts-check
import React from 'react'

// BEGIN (write your solution here)
export default class Progress extends React.Component {
  render() {
    const per = this.props.percentage

    return (
      <div className="progress">
        <div className="progress-bar" role="progressbar" aria-valuenow={per} aria-valuemin="0" aria-valuemax="100" aria-label="progressbar" style={{ width: `${per}%` }}>
        </div>
      </div>
    )
  }
}
// END
