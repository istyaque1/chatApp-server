import multer from "multer";

const imgConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `image${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new Error("only image is allowed"));
};

const upload = multer({
  storage: imgConfig,
  fileFilter: isImage,
});

export default upload;
