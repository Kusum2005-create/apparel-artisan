const mongoose = require("mongoose");

const User = require("../models/User");
const Product = require("../models/Product");

const users = require("./users");
const products = require("./products");

// Replace this with your MongoDB connection string later
const MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce_db";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Existing data deleted");

    // Insert sample data
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users inserted`);

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products inserted`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedDatabase();