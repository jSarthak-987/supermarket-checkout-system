import { PricingService } from '@/src/services/pricing.service';
import { PricingRuleModel, IPricingRule } from '@/src/models/PricingModel';

// --- Step 1: Mock PricingRuleModel.find ---
// Replace the real `find` with a Jest mock that we can control per-test.
jest.mock('@/src/models/PricingModel', () => {
  // Keep a real reference to IPricingRule for typing
  const originalModule = jest.requireActual('@/src/models/PricingModel') as {
    IPricingRule: unknown;
  };

  return {
    __esModule: true,
    ...originalModule,
    PricingRuleModel: {
      // Override `find` below in each test via jest.spyOn
      find: jest.fn(),
    },
  };
});

describe('PricingService', () => {
  let mockRules: IPricingRule[];

  beforeEach(() => {
    // Reset any previous mocks
    jest.clearAllMocks();

    // Prepare a few mock pricing‐rule documents
    mockRules = [
      {
        sku: 'A',
        unitPrice: 50,
        specialPrice: { quantity: 3, totalPrice: 130 },
      } as unknown as IPricingRule,
      {
        sku: 'B',
        unitPrice: 30,
        specialPrice: { quantity: 3, totalPrice: 75 },
      } as unknown as IPricingRule,
      {
        sku: 'C',
        unitPrice: 20,
        // no specialPrice for C
      } as unknown as IPricingRule,
    ];
  });

  test('loadPricingRules populates the internal map correctly', async () => {
    // Arrange: Make find() return our mockRules
    (PricingRuleModel.find as jest.Mock).mockResolvedValue(mockRules);

    const service = new PricingService();
    // Act: call loadPricingRules()
    await service.loadPricingRules();

    // Assert: internal map has exactly 3 entries
    const allMap = service.getAllRules();
    expect(allMap.size).toBe(3);

    // Each SKU should be present
    expect(allMap.has('A')).toBe(true);
    expect(allMap.has('B')).toBe(true);
    expect(allMap.has('C')).toBe(true);

    // And the values match
    const ruleA = service.getRule('A')!;
    expect(ruleA.unitPrice).toBe(50);
    expect(ruleA.specialPrice).toEqual({ quantity: 3, totalPrice: 130 });

    const ruleC = service.getRule('C')!;
    expect(ruleC.unitPrice).toBe(20);
    expect(ruleC.specialPrice).toBeUndefined();
  });

  test('getRule returns undefined for an SKU that was not loaded', async () => {
    // Arrange: Return only A and B
    (PricingRuleModel.find as jest.Mock).mockResolvedValue(
      mockRules.slice(0, 2)
    ); // [A, B]

    const service = new PricingService();
    await service.loadPricingRules();

    // Now only 'A' and 'B' should exist; 'C' was not returned by find()
    expect(service.getRule('A')).toBeDefined();
    expect(service.getRule('B')).toBeDefined();
    expect(service.getRule('C')).toBeUndefined();
    expect(service.getRule('UNKNOWN')).toBeUndefined();
  });

  test('calling loadPricingRules twice replaces old data with new data', async () => {
    // Arrange: First call returns only A and B
    (PricingRuleModel.find as jest.Mock).mockResolvedValueOnce(
      mockRules.slice(0, 2)
    );
    const service = new PricingService();
    await service.loadPricingRules();

    // After first load, only A and B exist
    expect(service.getAllRules().size).toBe(2);
    expect(service.getRule('A')).toBeDefined();
    expect(service.getRule('C')).toBeUndefined();

    // Now simulate a new database result that replaces B with C and adds D
    const newMock = [
      {
        sku: 'C',
        unitPrice: 20,
      } as unknown as IPricingRule,
      {
        sku: 'D',
        unitPrice: 100,
        specialPrice: { quantity: 5, totalPrice: 400 },
      } as unknown as IPricingRule,
    ];
    (PricingRuleModel.find as jest.Mock).mockResolvedValueOnce(newMock);

    // Act: reload
    await service.loadPricingRules();

    // Assert: old A, B should be gone. Now only C and D.
    const allAfterSecondLoad = service.getAllRules();
    expect(allAfterSecondLoad.size).toBe(2);
    expect(service.getRule('A')).toBeUndefined();
    expect(service.getRule('B')).toBeUndefined();
    expect(service.getRule('C')!.unitPrice).toBe(20);
    expect(service.getRule('D')!.specialPrice).toEqual({
      quantity: 5,
      totalPrice: 400,
    });
  });
});
