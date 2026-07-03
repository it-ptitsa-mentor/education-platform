const getHiddenFilesCount = (tree) => {
  if (tree.type === 'file') {
    return tree.name.startsWith('.') ? 1 : 0;
  }
  return tree.children.reduce((acc, child) => acc + getHiddenFilesCount(child), 0);
};

export default getHiddenFilesCount;
