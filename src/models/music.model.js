const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      required: true,
      match: /^https?:\/\/.+/,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    duration: {
      type: Number, // seconds
    },

    size: {
      type: Number, // bytes
    },

    mimeType: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);


// prevent duplicate uploads with same url
musicSchema.index({ uri: 1 }, { unique: true });


module.exports = mongoose.model("Music", musicSchema);