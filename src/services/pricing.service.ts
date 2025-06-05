import { PricingRuleModel, IPricingRule } from '@/src/models/PricingModel';

export class PricingService {
  private pricingRules: Map<string, IPricingRule> = new Map();

  constructor() {}

  /** Fetch all pricing rules from MongoDB. */
  async loadPricingRules(): Promise<void> {
    const rules = await PricingRuleModel.find();
    this.pricingRules.clear();
    rules.forEach((rule) => this.pricingRules.set(rule.sku, rule));
  }

  /** Get a single rule by SKU */
  getRule(sku: string): IPricingRule | undefined {
    return this.pricingRules.get(sku);
  }

  /** Return all rules as a Map<sku, rule> */
  getAllRules(): Map<string, IPricingRule> {
    return this.pricingRules;
  }
}
