// @ts-check
import { expect, test } from 'vitest'
import addAdmin, { User, Permission } from '../solution'

test('addAdmin', () => {
  const user: User = {
    login: 'login1',
  }

  const admin = addAdmin(user)
  expect(admin).toEqual({ ...user, permission: Permission.READ })
})
