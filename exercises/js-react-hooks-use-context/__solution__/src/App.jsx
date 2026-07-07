// @ts-check

import { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import ThemeSwitcher from './components/ThemeSwitcher.jsx'
import ThemeContext from './contexts/index.js'

const themes = [
  {
    id: 1,
    name: 'White',
    className: 'light',
  },
  {
    id: 2,
    name: 'Black',
    className: 'dark',
  },
  {
    id: 3,
    name: 'Blue',
    className: 'dark-blue',
  },
]

const ThemeProvider = ({ children }) => {
  // BEGIN (write your solution here)
  const [theme, setTheme] = useState(themes[0])

  return (
    <ThemeContext.Provider value={{ themes, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
  // END
}

const App = () => (
  <ThemeProvider>
    <Tabs className="mb-3">
      <Tab eventKey="home" title="Home">
        <Home />
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <Profile />
      </Tab>
    </Tabs>
    <ThemeSwitcher />
  </ThemeProvider>
)

export default App
