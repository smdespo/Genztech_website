const mongoose = require('mongoose');

async function connectDb(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log('Mongo connected:', mongoose.connection.name);
}

module.exports = { connectDb };
