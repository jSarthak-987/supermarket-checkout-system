import { IPricingRule } from '@/src/models/PricingModel';

export class Checkout {
  private items: string[] = [];

  constructor(private pricingRules: Map<string, IPricingRule>) {}

  /**
   * Scan a single SKU.
   * If the SKU is not found in pricingRules, log a warning and ignore it.
   */
  scan(sku: string): void {
    if (!this.pricingRules.has(sku)) {
      console.log(`\u0021 Item not found (ignored): SKU = ${sku}`);
      return; // ignore unknown SKU
    }
    this.items.push(sku);
  }

  /** Calculate the total price for all scanned items */
  total(): number {
    const counts: Record<string, number> = {};
    this.items.forEach((sku) => {
      counts[sku] = (counts[sku] || 0) + 1;
    });

    let totalPrice = 0;
    for (const [sku, count] of Object.entries(counts)) {
      const rule = this.pricingRules.get(sku)!;

      if (rule.specialPrice) {
        const { quantity: specialQty, totalPrice: specialTotal } =
          rule.specialPrice;
        const numSpecials = Math.floor(count / specialQty);
        const remainder = count % specialQty;
        totalPrice += numSpecials * specialTotal + remainder * rule.unitPrice;
      } else {
        totalPrice += count * rule.unitPrice;
      }
    }

    return totalPrice;
  }
}
