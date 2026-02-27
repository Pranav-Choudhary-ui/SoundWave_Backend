const mongoose = require("mongoose");

async function connectDB(retries = 5) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected");

  } catch (err) {
    console.error("MongoDB connection failed:", err.message);

    if (retries === 0) {
      console.error("No retries left. Exiting...");
      process.exit(1);
    }

    console.log(`Retrying connection... (${retries})`);
    await new Promise(res => setTimeout(res, 5000));

    return connectDB(retries - 1);
  }
}


/* ---------- CONNECTION EVENTS ---------- */

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});

mongoose.connection.on("error", err => {
  console.error("Mongoose error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});


module.exports = connectDB;