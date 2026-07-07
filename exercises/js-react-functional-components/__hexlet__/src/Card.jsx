// @ts-check
import React from 'react'

// BEGIN (write your solution here)
const Title = props => <h4 className='card-title'>{props.children}</h4>
const Text = props => <p className='card-text'>{props.children}</p>
const Body = props => <div className='card-body'>{props.children}</div>

export default class Card extends React.Component {
  static Title = Title
  static Body = Body
  static Text = Text
  render() {
    return <div className="card">{this.props.children}</div>
  }
}

// END
