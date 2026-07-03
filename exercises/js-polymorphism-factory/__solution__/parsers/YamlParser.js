import yaml from '../yaml.js';

export default class YamlParser {
  parse(content) {
    return yaml.load(content);
  }
}
