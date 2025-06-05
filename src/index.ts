import dotenv from 'dotenv';
import { Checkout } from './classes/Checkout';
import { connectMongo } from '@/src/connections/mongo.conn';
import { PricingService } from '@/src/services/pricing.service';

dotenv.config();

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Please define MONGO_URI in your .env file.');
    process.exit(1);
  }

  // 1. Connect to MongoDB
  await connectMongo(mongoUri);

  // 2. Instantiate PricingService and load all rules
  const pricingService = new PricingService();
  await pricingService.loadPricingRules();

  // 3. Create a new Checkout using the loaded rules
  const checkout = new Checkout(pricingService.getAllRules());

  // 4. Example usage (A=50/unit, 3@130; B=30/unit, 3@75; C=20/unit)
  const itemsToScan = ['A', 'B', 'A', 'A', 'B', 'B', 'B', 'D'];
  itemsToScan.forEach((sku) => checkout.scan(sku));

  console.log(`Scanned Items: [${itemsToScan.join(', ')}]`);
  console.log(`Total price: $${checkout.total()}`); // -> 235
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
