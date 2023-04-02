import multer from "multer";

const storage = multer.diskStorage({
  destination: "./src/uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
    return cb(new Error("Solo se permiten archivos de imagen"));
  }
  cb(null, true);
};

const uploader = multer({ storage: storage, fileFilter: fileFilter }).single(
  "avatar"
);

export default uploader;