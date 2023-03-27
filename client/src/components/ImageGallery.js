import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from "../config.js";

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

    // try {
      const response = await axios.post(apiUrl + '/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      getAllImages();
    // } catch (error) {
    //   console.error(error);
    // }
    
  };

  useEffect(() => {
    getAllImages();
  }, []);

  const getAllImages = () => {
    axios.get(apiUrl + "/images")
        .then((response) => {

          response.data.sort((a, b) => {
            if (a.id < b.id) {
              return -1;
            }
            if (a.id > b.id) {
              return 1;
            }
            return 0;
          });

          setImages(response.data.reverse());
        })
        .catch((error) => console.error(error));
  }

  return (
  <div className='page'>
    <div className='row'>
      <div className='col-lg-4 left'>

        <div className='form-area'>
          <div className='row row-header'>
            <h1 className='logo'>RENU</h1>
          </div>
          <div className="row row-footer">
              <ul>
                  <li>
                      <a href="https://www.facebook.com/mvrk.nz" target="_blank"><i className="fa fa-facebook-square"></i></a>
                  </li>
              </ul>
          </div>
          <div className='row row-form'>
            <form onSubmit={handleSubmit}>
              <div>
                {/* <label htmlFor="file">Choose an image:</label> */}
                <input type="file" id="file" name="file" onChange={handleFileChange} />
              </div>
              <div>
                {/* <label htmlFor="title">Title:</label> */}
                <input type="text" id="title"  name="title" placeholder="Title" value={title} onChange={handleChange} />
                {/* <label htmlFor="note">Note:</label> */}
                <textarea type="text" id="note"  name="note" placeholder="Note" value={note} onChange={handleChange} />
                <button type="submit">Upload</button>
              </div>
            </form>
          </div>
        </div>

          
      </div>
      <div className='col-lg-8 right'>
        <div className="grid-container">
          {
            images.map((image, index) => {
            return (
              <div className="item" key={index}>
                <img className="image" src={image.data} />
              </div>
            )
            })
          }
        </div>
      </div>
    </div>
  </div>
  );
}

export default ImageGallery;

