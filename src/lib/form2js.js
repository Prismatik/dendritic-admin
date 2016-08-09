export function handleNumbers(node) {
  if (node.nodeName === 'INPUT' && node.type === 'number') {
    const val = parseInt(node.value);
    if (!val) return false;
    return { name: node.name, value: val };
  };
  return false;
}
