import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from "../config.js";

import "./ImageGallery.css";

const apiUrl = config.apiUrl;

function ImageGallery() {
  const [secretCode, setSecretCode] = useState("Renu1980");
  const [loginCode, setLoginCode] = useState("");

  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [images, setImages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("logged-in"));

  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState({
    src: "",
    title: "",
    note: "",
    date: "",
  });

  useEffect(() => {
    getAllImages();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const openPreview = () => {
    setPreview(true);
  };

  const closePreview = () => {
    setPreview(false);
  };

  const handleChange = (event) => {
    var key = event.target.name;
    var value = event.target.value;

    switch (key) {
      case "title":
        setTitle(value);
        break;
      case "note":
        setNote(value);
        break;
      case "loginCode":
        setLoginCode(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("note", note);
    formData.append("date", date);

    const response = await axios.post(apiUrl + "/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setFile(null);
    setNote("");
    setTitle("");

    getAllImages();
  };

  const handleLogin = () => {
    if (loginCode === secretCode) {
      localStorage.setItem("logged-in", true);
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("logged-in");
    setLoggedIn(false);
  };

  const getAllImages = () => {
    axios
      .get(apiUrl + "/images")
      .then((response) => {
        var sorted = response.data.sort((a, b) => b.image.id - a.image.id);

        setImages(sorted);
      })
      .catch((error) => console.error(error));
  };

  const handleImage = (image) => {
    setImage({...image.image, src: image.data});
    openPreview();
  };

  return (
    <div className="page">
      <div className="row">
        <div className="col-lg-4 left">
          <div className="form-area">
            <div className="row row-header">
              <h1 className="logo">RENU</h1>
            </div>
            <hr></hr>
            <div className="row row-footer">
              <ul>
                <li>
                  <a href="https://www.facebook.com/mvrk.nz" target="_blank">
                    <i className="fa fa-facebook-square"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="row row-form">
              <form className="login-form">
                <div>
                  {!loggedIn ? (
                    <div>
                      <input
                        type="text"
                        id="loginCode"
                        name="loginCode"
                        placeholder="Enter your code"
                        value={loginCode}
                        onChange={handleChange}
                      />
                      <button
                        type="submit"
                        className="login-btn"
                        onClick={() => handleLogin()}
                      >
                        Login
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="submit"
                        className="logout-btn"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {loggedIn ? (
                <form className="upload-form" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                    />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Title"
                      value={title}
                      onChange={handleChange}
                    />
                    <textarea
                      type="text"
                      id="note"
                      name="note"
                      placeholder="Note"
                      value={note}
                      onChange={handleChange}
                    />
                    <button type="submit" className="upload-btn">
                      Upload
                    </button>
                  </div>
                </form>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-8 right">
          <div className="grid-container">
            {images.map((image, index) => {
              return (
                <div
                  className="item"
                  key={image.image.id}
                  onClick={() => handleImage(image)}
                >
                  <img key={index} className="image" src={image.data} />
                </div>
              );
            })}

            {preview ? (           
              <div className="preview">
                <i onClick={closePreview} className="fa fa-close close-btn"></i><br></br>               
                <div className="preview-body">
                  <div className='row'>
                    <div className='col-md-6 image-section'>
                      <img className="preview-image" src={image.src} alt={title} />
                    </div>     
                    <div className='col-md-6 info-section'>
                      <p className='date'>{image.date}</p>
                      <h2 className='title'>{image.title}</h2>
                      <p className='note'>{image.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}

export default ImageGallery;

