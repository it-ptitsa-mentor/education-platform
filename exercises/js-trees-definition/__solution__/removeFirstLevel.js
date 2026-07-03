const removeFirstLevel = (tree) => tree.filter(Array.isArray).flat();

export default removeFirstLevel;
