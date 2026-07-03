import fs from 'node:fs';
import path from 'node:path';
import Config from './Config.js';
import JsonParser from './parsers/JsonParser.js';
import YamlParser from './parsers/YamlParser.js';

const getParser = (extension) => {
  switch (extension) {
    case '.json':
      return new JsonParser();
    case '.yaml':
    case '.yml':
      return new YamlParser();
    default:
      throw new Error(`Unknown config format: ${extension}`);
  }
};

export default class ConfigFactory {
  static factory(filePath) {
    const parser = getParser(path.extname(filePath));
    const content = fs.readFileSync(filePath, 'utf-8');
    return new Config(parser.parse(content));
  }
}
