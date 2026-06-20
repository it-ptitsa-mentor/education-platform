const beginPoint = new Point(1, 10);
const endPoint = new Point(11, -3);

const segment = new Segment(beginPoint, endPoint);
const reversedSegment = reverse(segment);

// прямое обращение к свойствам приведено только в демонстрационных целях
console.log(
  segment.beginPoint.x,
  segment.beginPoint.y,
  segment.endPoint.x,
  segment.endPoint.y,
);// => 1 10 11 -3

console.log(
  reversedSegment.beginPoint.x,
  reversedSegment.beginPoint.y,
  reversedSegment.endPoint.x,
  reversedSegment.endPoint.y,
); // => 11 -3 1 10