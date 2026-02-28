const { ImageKit } = require("@imagekit/nodejs");
const crypto = require("crypto");


const {
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_URL_ENDPOINT,
  NODE_ENV
} = process.env;


if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error("ImageKit environment variables missing");
}


const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT
});


function generateFileName() {
  return "music_" + crypto.randomBytes(16).toString("hex");
}


async function uploadFile(fileBuffer) {
  if (!fileBuffer) {
    throw new Error("No file provided");
  }

  try {
    const result = await imagekit.files.upload({
      file: fileBuffer,
      fileName: generateFileName(),
      folder: `${NODE_ENV || "dev"}/music`
    });

    return result;

  } catch (err) {
    console.error("Upload failed:", err.message);
    throw new Error("File upload failed");
  }
}


module.exports = { uploadFile };