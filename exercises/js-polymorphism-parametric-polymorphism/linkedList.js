import Node from './Node';
import reverse from './linkedList';

const numbers = new Node(1, new Node(2, new Node(3))); // (1, 2, 3)
const reversedNumbers = reverse(numbers); // (3, 2, 1)