const imageFile = new ImageFile({
  name: 'image.png',
  size: 100,
  width: 200,
  height: 300,
});
console.log(imageFile.toString()); // image.png (100 bytes) 200x300