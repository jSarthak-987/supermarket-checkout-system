import {
  MongoClient,
  Db,
  Collection,
  InsertManyResult,
  DeleteResult,
} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

interface SpecialPrice {
  quantity: number;
  totalPrice: number;
}

interface PricingRule {
  sku: string;
  unitPrice: number;
  specialPrice?: SpecialPrice;
}

async function runSeed(): Promise<void> {
  const uri: string = 'mongodb://localhost:27017/checkoutdb';
  const client: MongoClient = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB:', uri);

    const db: Db = client.db(); // uses database name from URI (checkoutdb)
    const collection: Collection<PricingRule> = db.collection('pricingrules');

    // 1. Clear existing documents in `pricingrules`
    const deleteResult: DeleteResult = await collection.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing documents.`);

    // 2. Insert example pricing rules
    const exampleRules: PricingRule[] = [
      {
        sku: 'A',
        unitPrice: 50,
        specialPrice: { quantity: 3, totalPrice: 130 },
      },
      {
        sku: 'B',
        unitPrice: 30,
        specialPrice: { quantity: 3, totalPrice: 75 },
      },
      {
        sku: 'C',
        unitPrice: 20,
        // no specialPrice for C
      },
    ];

    const insertResult: InsertManyResult =
      await collection.insertMany(exampleRules);
    console.log(
      `Inserted ${insertResult.insertedCount} pricing rules:`,
      Object.values(insertResult.insertedIds)
    );
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

runSeed().catch((err) => {
  console.error('Unhandled error in seed script:', err);
  process.exit(1);
});
