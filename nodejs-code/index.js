const express = require("express");
const cors = require("cors");
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,  uniqueSuffix + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

const app = express();

app.use(express.json());
app.use(cors());

const port = 3000;

app.post('/photo', upload.single('photo'), (req, res, next) => {
    try {
        // req.file is the `photo` file
        // req.body will hold the text fields, if there were any
        console.log(req.file);
        res.status(200).send(req.file);
    } catch(e) {
        next(e);
    }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});