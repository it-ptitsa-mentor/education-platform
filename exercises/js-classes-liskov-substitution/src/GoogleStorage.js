import GoogleStorage from './GoogleStorage.js'

const storage = new GoogleStorage()
storage.set('one', 'two')
storage.get('one') // 'two'
storage.count() // Error