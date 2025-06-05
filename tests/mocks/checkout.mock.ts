import { IPricingRule } from '@/src/models/PricingModel';

const ruleA = {
  sku: 'A',
  unitPrice: 50,
  specialPrice: { quantity: 3, totalPrice: 130 },
} as unknown as IPricingRule;

const ruleB = {
  sku: 'B',
  unitPrice: 30,
  specialPrice: { quantity: 3, totalPrice: 75 },
} as unknown as IPricingRule;

const ruleC = {
  sku: 'C',
  unitPrice: 20,
} as unknown as IPricingRule;

export const pricingRulesMap: Map<string, IPricingRule> = new Map([
  ['A', ruleA],
  ['B', ruleB],
  ['C', ruleC],
]);
