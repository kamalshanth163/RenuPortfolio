const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require("fs");

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());


// Upload an image
app.post('/api/upload', upload.single('file'), (req, res) => {

  const file = req.file;

    fs.readFile("data.json", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        let images = [];

        if (data.length !== 0) {
          images = JSON.parse(data.toString()).images;
        }
        
        const image = {
          id: images.length + 1, 
          name: `${images.length + 1}.${file.originalname.split('.')[1]}`,
          title: req.body.title,
          note: req.body.note,
          date: req.body.date
        };

        images.push(image);

        const readStream = fs.createReadStream(file.path);
        const writeStream = fs.createWriteStream("uploads/" + image.name);
        readStream.pipe(writeStream);

        const dataToWrite = { images };
        fs.writeFile(
          "data.json",
          JSON.stringify(dataToWrite),
          (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Data saved to file");
            }
          }
        );
      }
    });

    res.send("File saved successfully");
  });
// });


// Get all images
app.get('/images', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');

  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const imagePromises = files.filter(file => {
        return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png');
      }).map(file => {
        return new Promise((resolve, reject) => {
          getImageDataById(file.split(".")[0], (err, image) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {        
              const data = fs.readFileSync(path.join(directoryPath, file));
              const base64 = Buffer.from(data).toString('base64');
          
              const imageData = {
                filename: file,
                data: `data:image/png;base64,${base64}`,
                image: image
              };
          
              resolve(imageData);
            }
          });
        });
      });
      Promise.all(imagePromises).then(images => {
        res.json(images);
      }).catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
    }
  });
});


const getImageDataById = (id, callback) => {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      const images = JSON.parse(data.toString()).images;
      const image = images.find(i => i.id == id);
      callback(null, image);
    }
  });
}

app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
