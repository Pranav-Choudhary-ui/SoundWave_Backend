const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


// Limit tracks per album
albumSchema.path("musics").validate(function (value) {
  return value.length <= 100;
}, "Album cannot contain more than 100 tracks");


module.exports = mongoose.model("Album", albumSchema);