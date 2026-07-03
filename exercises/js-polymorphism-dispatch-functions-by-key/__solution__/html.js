const buildAttrsLine = (attrs) => Object.entries(attrs)
  .map(([name, value]) => ` ${name}="${value}"`)
  .join('');

const stringify = (tag) => {
  const { name, tagType, body, ...attrs } = tag;
  const attrsLine = buildAttrsLine(attrs);
  if (tagType === 'single') {
    return `<${name}${attrsLine}>`;
  }
  return `<${name}${attrsLine}>${body}</${name}>`;
};

export default stringify;
