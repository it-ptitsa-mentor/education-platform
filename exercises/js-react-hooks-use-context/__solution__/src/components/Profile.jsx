// @ts-check

import { useContext } from 'react'

import ThemeContext from '../contexts'

const Profile = () => {
  // BEGIN (write your solution here)
  const { theme } = useContext(ThemeContext)
  const className = theme.className
  // END

  return (
    <article className={className}>
      Текст для вкладки Profile
    </article>
  )
}

export default Profile
