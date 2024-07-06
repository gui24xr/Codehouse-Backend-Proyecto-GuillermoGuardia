import { expect } from 'chai';
import { sum, subtract } from '../src/math';

describe('Math functions', () => {
  describe('sum', () => {
    it('should return 4 when adding 2 and 2', () => {
      expect(sum(2, 2)).to.equal(4);
    });

    it('should return 0 when adding -2 and 2', () => {
      expect(sum(-2, 2)).to.equal(0);
    });
  });

  describe('subtract', () => {
    it('should return 2 when subtracting 4 from 6', () => {
      expect(subtract(6, 4)).to.equal(2);
    });

    it('should return -3 when subtracting 7 from 4', () => {
      expect(subtract(4, 7)).to.equal(-3);
    });
  });
});
