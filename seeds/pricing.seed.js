// This script will run inside the MongoDB container on first initialization.
// It uses the mongo shell API to insert a few example pricing rules into
// the "checkoutdb" database, collection "pricingrules".

db = db.getSiblingDB('checkoutdb');

if (db.pricingrules.countDocuments({}) === 0) {
  db.pricingrules.insertMany([
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
    },
  ]);
  print('Seeded pricingrules collection with initial data.');
} else {
  print('pricingrules already has data; skipping seed.');
}
