// @ts-check

import React from 'react'
import ThemeContext from './contexts'

const content = 'Текст для вкладки Home'

class Home extends React.Component {
  // BEGIN (write your solution here)
  static contextType = ThemeContext
  
  render() {
    const { theme } = this.context

    return (
      <article className={theme.className}>{content}</article>
    )
  }
  // END
}

export default Home
