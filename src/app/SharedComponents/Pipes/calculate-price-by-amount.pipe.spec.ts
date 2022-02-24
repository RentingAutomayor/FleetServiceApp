import { CalculatePriceByAmountPipe } from './calculate-price-by-amount.pipe';

describe('CalculatePriceByAmountPipe', () => {
  it('create an instance', () => {
    const pipe = new CalculatePriceByAmountPipe();
    expect(pipe).toBeTruthy();
  });
});
