import { move } from './file.js'

move('/opt/myfile', '/tmp/newfile', (error) => {
  if (error) {
    console.log('oops')
    return
  }
  console.log('yes!')
})