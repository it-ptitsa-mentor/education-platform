const pathToConfigs = path.join(__dirname, '__fixtures__');
const loader = new DatabaseConfigLoader(pathToConfigs);
const config = loader.load('production'); // loading database.production.json
// {
//   host: 'google.com',
//   username: 'postgres',
// };