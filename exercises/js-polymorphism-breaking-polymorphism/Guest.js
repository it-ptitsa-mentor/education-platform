import Guest from '../Guest.js';
import User from '../User.js';
import getGreeting from '../helpers.js';

const guest = new Guest();
getGreeting(guest); // 'Nice to meet you Guest!'

const user = new User('Petr');
getGreeting(user); // 'Hello Petr!'