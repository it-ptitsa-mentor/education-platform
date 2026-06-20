const json = '{ "key": "value" }';
parseJson(json); // { key: 'value' }

const incorrectJson = '{ key": "value" }';
parseJson(incorrectJson); // => ParseError: Invalid JSON string