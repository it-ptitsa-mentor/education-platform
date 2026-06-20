const file1 = new File({ name: 'open-world.jpeg', size: 1000 });
console.log(`${file1}`); // open-world.jpeg (1000 bytes)

const file2 = new File(file1);
console.log(`${file2}`); // (copy) open-world.jpeg (1000 bytes)

const file3 = new File(file2);
console.log(`${file3}`); // (copy) open-world.jpeg (1000 bytes)