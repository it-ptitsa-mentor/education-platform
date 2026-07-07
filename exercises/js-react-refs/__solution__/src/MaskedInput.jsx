// @ts-check

import IMask from 'imask'
import React from 'react'

export default class MaskedInput extends React.Component {
  // BEGIN (write your solution here)
  inputRef = React.createRef();

  componentDidMount() {
    const { onAccept } = this.props;
    this.mask = IMask(this.inputRef.current, { mask: '+7(000)000-00-00' });
    this.mask.on('accept', () => onAccept(this.mask.value));
  }

  componentWillUnmount() {
    this.mask.destroy();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }
  // END
}
