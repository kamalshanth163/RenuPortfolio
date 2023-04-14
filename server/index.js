const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require("fs");

const app = express();
const upload = multer({ dest: 'uploads/' });
const data = require('./data.json');

const PORT = process.env.PORT || 5000;

app.use(cors());

// Upload a post
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let posts = [];

      if (data.length !== 0) {
        posts = JSON.parse(data.toString()).posts;
      }

      const post = {
        id: posts.length + 1,
        name: `${posts.length + 1}.${file.originalname.split(".")[1]}`,
        title: req.body.title,
        note: req.body.note,
        date: req.body.date,
      };

      posts.push(post);

      const readStream = fs.createReadStream(file.path);
      const writeStream = fs.createWriteStream("uploads/" + post.name);
      readStream.pipe(writeStream);

      const dataToWrite = { posts };
      fs.writeFile("data.json", JSON.stringify(dataToWrite), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Data saved to file");
        }
      });
      res.send(JSON.parse(data.toString()).posts);
    }
  });
});

// Get posts data
app.get('/posts', (req, res) => {
  const posts = data.posts;
  res.json(posts);
});

// Delete a post
app.delete("/posts/:name", (req, res) => {
  const name = req.params.name;
  const id = parseInt(name.split(".")[0]);
  deletePostById(id);
  deleteImage(`${__dirname}/uploads`, name);
  res.status(200).send("Record deleted successfully.");
});

// Get image
app.get("/images/:name", (req, res) => {
  const imagePath = path.join(__dirname, "uploads", req.params.name);
  const imageStream = fs.createReadStream(imagePath);
  imageStream.pipe(res);
});

const deletePostById = (id) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  for (let i = 0; i < data.posts.length; i++) {
    if (data.posts[i].id === id) {
      data.posts.splice(i, 1);
      break;
    }
  }
  fs.writeFileSync("data.json", JSON.stringify(data));
};

const deleteImage = (folderPath, fileName) => {
  const filePath = path.join(folderPath, fileName);

  fs.unlink(filePath, (error) => {
    if (error) {
      console.error(`Error deleting file ${filePath}: ${error}`);
    } else {
      console.log(`File ${filePath} deleted successfully`);
    }
  });
};

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
