export const compressImages = (tree) => {
  const children = tree.children.map((child) => {
    if (child.type === 'file' && child.name.endsWith('.jpg')) {
      return { ...child, meta: { ...child.meta, size: child.meta.size / 2 } };
    }
    return child;
  });
  return { ...tree, children };
};

export default compressImages;
