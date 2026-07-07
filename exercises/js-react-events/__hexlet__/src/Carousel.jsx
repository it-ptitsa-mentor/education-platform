// @ts-check

import cn from 'classnames'
import React from 'react'

// BEGIN (write your solution here)
import { uniqueId } from 'lodash'

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  handleNext = () => {
    if (this.state.count === this.props.images.length - 1) this.setState({ count: 0 })
    else this.setState({ count: this.state.count + 1 })
  }

  handlePrev = () => {
    if (this.state.count === 0) this.setState({ count: this.props.images.length - 1 })
    else this.setState({ count: this.state.count - 1 })
  }

  render() {
    const images = this.props.images

    return (
      <div id="carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {images.map((it, i) => {
            return (
              <div key={uniqueId()} className={cn('carousel-item', { active: i === this.state.count })}>
                <img alt="" className="d-block w-100" src={it} />
              </div>
            )
          })}
        </div>
        <button onClick={this.handlePrev} className="carousel-control-prev" data-bs-target="#carousel" type="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button onClick={this.handleNext} className="carousel-control-next" data-bs-target="#carousel" type="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    )
  }
}
// END
