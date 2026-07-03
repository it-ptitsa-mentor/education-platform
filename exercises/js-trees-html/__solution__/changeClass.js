const changeClass = (tree, oldClassName, newClassName) => {
  const className = tree.className === oldClassName ? newClassName : tree.className;
  const children = (tree.children ?? []).map(
    (child) => changeClass(child, oldClassName, newClassName),
  );
  return { ...tree, className, children };
};

export default changeClass;
