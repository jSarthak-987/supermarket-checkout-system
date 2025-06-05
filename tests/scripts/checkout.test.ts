import { Checkout } from '@/src/classes/Checkout';
import { IPricingRule } from '@/src/models/PricingModel';
import { pricingRulesMap } from '@/tests/mocks/checkout.mock';

describe('Checkout', () => {
  let pricingRules: Map<string, IPricingRule>;

  beforeAll(() => {
    pricingRules = pricingRulesMap;
  });

  test('A + B = 80', () => {
    const co = new Checkout(pricingRules);
    co.scan('A');
    co.scan('B');
    expect(co.total()).toBe(80);
  });

  test('A + A = 100', () => {
    const co = new Checkout(pricingRules);
    co.scan('A');
    co.scan('A');
    expect(co.total()).toBe(100);
  });

  test('A + A + A = 130', () => {
    const co = new Checkout(pricingRules);
    co.scan('A');
    co.scan('A');
    co.scan('A');
    expect(co.total()).toBe(130);
  });

  test('B + B + B = 75', () => {
    const co = new Checkout(pricingRules);
    co.scan('B');
    co.scan('B');
    co.scan('B');
    expect(co.total()).toBe(75);
  });

  test('B + B + C = 80', () => {
    const co = new Checkout(pricingRules);
    co.scan('B');
    co.scan('B');
    co.scan('C');
    expect(co.total()).toBe(80);
  });

  test('Unknown SKU is ignored, known items still count', () => {
    const co = new Checkout(pricingRules);
    co.scan('A'); // known
    co.scan('UNKNOWN'); // should be ignored
    co.scan('B'); // known
    co.scan('UNKNOWN2'); // ignored
    expect(co.total()).toBe(80);
  });
});
