import path from 'node:path';

const findFilesByName = (tree, substr) => {
  const iter = (node, ancestry) => {
    const currentPath = path.join(ancestry, node.name);
    if (node.type === 'file') {
      return node.name.includes(substr) ? [currentPath] : [];
    }
    return node.children.flatMap((child) => iter(child, currentPath));
  };
  return iter(tree, '');
};

export default findFilesByName;
