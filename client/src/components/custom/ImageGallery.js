import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from "../../config.js";
import 'bootstrap/dist/css/bootstrap.css';

import './ImageGallery.css';

const apiUrl = config.apiUrl;

function ImageGallery() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (event) => {
    var key = event.target.name;
    var value = event.target.value;

    switch(key){
      case "title":
        setTitle(value);
        break;
      case "note":
        setNote(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('note', note);
    formData.append('date', date);

    try {
      const response = await axios.post(apiUrl + '/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      getAllImages();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  const getAllImages = () => {
    axios.get(apiUrl + "/images")
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => console.error(error));
  }

  return (

  <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Choose an image:</label>
        <input type="file" id="file" name="file" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title"  name="title" value={title} onChange={handleChange} />
        <label htmlFor="note">Note:</label>
        <textarea type="text" id="note"  name="note" value={note} onChange={handleChange} />
      </div>
      <button type="submit">Upload</button>
    </form>

    <div class="grid-container">
      {
        images.map(image => {
        return (
          <div class="item">
            {/* <div class="" style={{width: "360px", height: "240px", background: `url("${image.data}")`}}> */}
            <img class="" style={{width: "500px", height: "240px"}}src={image.data} alt="First slide" />
            {/* </div> */}
          </div>
        )
        })
      }
    </div>

  </div>
  );
}

export default ImageGallery;

