import watch from './watcher.js'

const id = watch(filepath, 500, (err) => {
  console.log('Wow!')
})

setTimeout(() => fs.appendFileSync(filepath, 'ehu'), 700)
setTimeout(() => clearInterval(id), 5000) // остановить отслеживание через 5 секунд