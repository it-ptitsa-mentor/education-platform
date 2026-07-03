function Segment(beginPoint, endPoint) {
  this.beginPoint = beginPoint;
  this.endPoint = endPoint;
}

Segment.prototype.getBeginPoint = function getBeginPoint() {
  return this.beginPoint;
};

Segment.prototype.getEndPoint = function getEndPoint() {
  return this.endPoint;
};

export default Segment;
