// @ts-check

export default (doc) => {
  doc.querySelectorAll('div').forEach((div) => {
    [...div.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const p = doc.createElement('p');
        p.textContent = node.textContent;
        node.replaceWith(p);
      }
    });
  });
};
