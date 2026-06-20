const mask = IMask(element, {
  mask: '+{7}(000)000-00-00',
});

mask.on('accept', () => {
  const value = mask.value;
  // код, который будет вызван при каждом изменении значения
});