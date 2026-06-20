import HTMLHrElement from './HTMLHrElement.js'
const hr = new HTMLHrElement()
console.log(hr.toString()) // => <hr>

const hr = new HTMLHrElement({ class: 'w-75', id: 'wop' })
console.log(hr.toString()) // => '<hr class="w-75" id="wop">';