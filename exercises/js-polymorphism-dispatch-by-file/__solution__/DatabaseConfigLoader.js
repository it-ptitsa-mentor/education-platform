import fs from 'node:fs';
import path from 'node:path';

export default class DatabaseConfigLoader {
  constructor(configsPath) {
    this.configsPath = configsPath;
  }

  load(env) {
    const filePath = path.join(this.configsPath, `database.${env}.json`);
    const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Object.hasOwn(config, 'extend')) {
      return config;
    }
    const { extend, ...rest } = config;
    const parent = this.load(extend);
    return { ...parent, ...rest };
  }
}
