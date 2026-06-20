const cities = ['moscow', 'london', 'berlin', 'porto', '', null, undefined]

get(cities, 1) // 'london'
get(cities, 4) // ''
get(cities, 10, 'paris') // 'paris'
get(cities, -1, 'oops') // 'oops'
get(cities, 5, 'oops') // null
get(cities, 6, 'oops') // undefined
get(cities, 7) // null