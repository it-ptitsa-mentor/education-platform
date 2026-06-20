import write from './writer.js'

write('./myfile', 'data', () => {
  console.log('success')
})