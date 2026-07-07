// @ts-check

import React from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'

import ThemeContext from './contexts'

class ThemeSwitcher extends React.Component {
  // BEGIN (write your solution here)
  static contextType = ThemeContext

  render() {
    const { themes, theme, setTheme } = this.context

    return (
      <ButtonGroup className="mb-2">
        {themes.map(t =>
          <ToggleButton
            id={t.id}
            type="radio"
            variant="secondary"
            checked={t.id === theme.id}
            value={t.id}
            onChange={() => setTheme(t)} >
            {t.name}
          </ToggleButton>
        )}

      </ButtonGroup>
    )
  }
  // END
}

export default ThemeSwitcher
