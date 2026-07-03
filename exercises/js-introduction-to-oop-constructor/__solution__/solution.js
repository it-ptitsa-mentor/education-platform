import Point from './Point.js';
import Segment from './Segment.js';

const reverse = (segment) => {
  const begin = segment.getBeginPoint();
  const end = segment.getEndPoint();
  return new Segment(
    new Point(end.getX(), end.getY()),
    new Point(begin.getX(), begin.getY()),
  );
};

export default reverse;
