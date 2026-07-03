const getSize = (node) => {
  if (node.type === 'file') {
    return node.meta.size ?? 0;
  }
  return node.children.reduce((acc, child) => acc + getSize(child), 0);
};

const du = (tree) => tree.children
  .map((child) => [child.name, getSize(child)])
  .sort(([, sizeA], [, sizeB]) => sizeB - sizeA);

export default du;
