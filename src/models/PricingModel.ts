import mongoose, { Document, Schema } from 'mongoose';

export interface ISpecialPrice {
  quantity: number;
  totalPrice: number;
}

export interface IPricingRule extends Document {
  sku: string;
  unitPrice: number;
  specialPrice?: ISpecialPrice;
}

const SpecialPriceSchema = new Schema<ISpecialPrice>(
  {
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const PricingRuleSchema = new Schema<IPricingRule>(
  {
    sku: { type: String, required: true, unique: true },
    unitPrice: { type: Number, required: true },
    specialPrice: { type: SpecialPriceSchema, required: false },
  },
  { collection: 'pricingrules' }
);

export const PricingRuleModel = mongoose.model<IPricingRule>(
  'PricingRule',
  PricingRuleSchema
);
