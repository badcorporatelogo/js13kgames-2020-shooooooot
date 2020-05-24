import Chain from './Chain'

const dummyObject = {};
const dummyProperty = 'property';

export default class TimedEvent extends Chain {
  constructor(callback, delay) {
    super(0, (t) => {
      if (t === 1) {
        callback();
      }
    }, dummyObject, dummyProperty, delay);
  }
}
