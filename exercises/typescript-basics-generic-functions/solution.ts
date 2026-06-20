const coll: MyArray<number> = ...;
coll.push(1); // 1
coll.push(10); // 2
coll.push(99); // 3

const newColl = coll.filter((value) => value % 2 == 0);
console.log(newColl.items); // [10]