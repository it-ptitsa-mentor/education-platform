console.log(buildUser())
// {
//   email: 'Zion.Reichel12@yahoo.com',
//   firstName: 'Elizabeth',
//   lastName: 'Zulauf',
// }

// Если какой-то из параметров нужно задать точно, то его можно передать в функцию
console.log(buildUser({ firstName: 'Petya' }))
// {
//   email: 'Zion.Reichel12@yahoo.com',
//   firstName: 'Petya',
//   lastName: 'Zulauf',
// }