import { CalculateTaxesPipe } from './calculate-taxes.pipe';

describe('CalculateTaxesPipe', () => {
  it('create an instance', () => {
    const pipe = new CalculateTaxesPipe();
    expect(pipe).toBeTruthy();
  });
});
