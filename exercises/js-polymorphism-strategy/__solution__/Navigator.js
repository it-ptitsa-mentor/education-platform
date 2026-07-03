import Walking from './strategies/Walking.js';
import Driving from './strategies/Driving.js';

const strategies = {
  walking: Walking,
  driving: Driving,
};

export default class Navigator {
  constructor(locations, strategyName = 'walking') {
    this.locations = locations;
    this.currentIndex = 0;
    this.strategy = new strategies[strategyName]();
  }

  goToNextTurn() {
    const nextIndex = this.strategy.getNextIndex(this.currentIndex);
    if (nextIndex >= this.locations.length) {
      this.currentIndex = this.locations.length - 1;
      return null;
    }
    this.currentIndex = nextIndex;
    return this.locations[nextIndex];
  }
}
