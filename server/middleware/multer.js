import multer from "multer";

const storage = multer.diskStorage({
  try: {
    destination: (req, file, cb) => {
      cb(null, "./public");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  },
  catch(error) {
    console.log("Error in Multer : ", error);
  },
});

export const upload = multer({ storage });
