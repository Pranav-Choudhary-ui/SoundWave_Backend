const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      lowercase: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["user", "artist"],
      default: "user"
    }
  },
  { timestamps: true }
);


// ONLY indexes here
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });


module.exports = mongoose.model("User", userSchema);