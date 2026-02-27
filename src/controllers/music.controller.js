const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");


// CREATE MUSIC
async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({ message: "Title and audio file required" });
    }

    if (!file.mimetype.startsWith("audio/")) {
      return res.status(400).json({ message: "Only audio files allowed" });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    res.status(201).json({
      message: "Music created successfully",
      music
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// CREATE ALBUM
async function createAlbum(req, res) {
  try {
    const { title, musics } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    if (!Array.isArray(musics)) {
      return res.status(400).json({ message: "Musics must be array" });
    }

    // verify ownership
    const ownedTracks = await musicModel.find({
      _id: { $in: musics },
      artist: req.user.id
    });

    if (ownedTracks.length !== musics.length) {
      return res.status(403).json({
        message: "You can only use your own tracks"
      });
    }

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics
    });

    res.status(201).json({
      message: "Album created successfully",
      album
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// GET ALL MUSICS (paginated)
async function getAllMusics(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const musics = await musicModel
      .find()
      .populate("artist", "username email")
      .skip(skip)
      .limit(limit);

    res.json({ page, musics });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// GET ALL ALBUMS
async function getAllAlbums(req, res) {
  try {
    const albums = await albumModel
      .find()
      .select("title artist")
      .populate("artist", "username email");

    res.json({ albums });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// GET ALBUM BY ID
async function getAlbumById(req, res) {
  try {
    const album = await albumModel
      .findById(req.params.albumId)
      .populate("artist", "username email")
      .populate("musics");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.json({ album });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById
};