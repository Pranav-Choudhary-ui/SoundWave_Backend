const express = require("express");
const multer = require("multer");

const musicController = require("../controllers/music.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();


/* ---------- MULTER CONFIG ---------- */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files allowed"), false);
    }
    cb(null, true);
  }
});


/* ---------- ROUTES ---------- */

// Upload music
router.post(
  "/musics",
  authenticate,
  authorize("artist"),
  upload.single("music"),
  musicController.createMusic
);


// Create album
router.post(
  "/albums",
  authenticate,
  authorize("artist"),
  musicController.createAlbum
);


// Get all musics
router.get(
  "/musics",
  authenticate,
  authorize("user", "artist"),
  musicController.getAllMusics
);


// Get all albums
router.get(
  "/albums",
  authenticate,
  authorize("user", "artist"),
  musicController.getAllAlbums
);


// Get album by ID
router.get(
  "/albums/:albumId",
  authenticate,
  authorize("user", "artist"),
  musicController.getAlbumById
);


module.exports = router;