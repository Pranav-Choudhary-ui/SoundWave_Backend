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

// Upload music -> POST /api/musics
router.post(
  "/musics",
  authenticate,
  authorize("artist"),
  upload.single("music"),
  musicController.createMusic
);

// Create album -> POST /api/albums
router.post(
  "/albums",
  authenticate,
  authorize("artist"),
  musicController.createAlbum
);

// Get all musics -> GET /api/musics
router.get(
  "/musics",
  authenticate,
  authorize("user", "artist"),
  musicController.getAllMusics
);

// Get all albums -> GET /api/albums
router.get(
  "/albums",
  authenticate,
  authorize("user", "artist"),
  musicController.getAllAlbums
);

// Get album by ID -> GET /api/albums/:albumId
router.get(
  "/albums/:albumId",
  authenticate,
  authorize("user", "artist"),
  musicController.getAlbumById
);

module.exports = router;