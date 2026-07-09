// @ts-check

import { useSelector } from 'react-redux'
import User from './User.jsx'

import { selectors } from '../slices/usersSlice.js'

const Users = () => {
  const users = useSelector(selectors.selectAll)

  return (
    <div className="mt-3">
      <div className="card mb-5">
        <div className="card-header">
          Список пользователей
        </div>
        <div className="card-body">
          {users.map(user => (
            <User key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Users
