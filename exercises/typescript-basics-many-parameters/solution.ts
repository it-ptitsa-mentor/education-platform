const map: MyMap<string, number> = ...;
map.set('one', 1);
map.set('two', 2);

map.get('one'); // 1
map.get('two'); // 2
map.get('three'); // undefined