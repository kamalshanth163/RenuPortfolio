import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from "../config.js";
// import { useNavigate } from "react-router-dom";

import "./ImageGallery.css";
import { useRef } from 'react';

const apiUrl = config.apiUrl;

function ImageGallery() {
  // const navigate = useNavigate();

  const [secretCode] = useState("Renu1980");
  const [loginCode, setLoginCode] = useState("");

  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date] = useState(new Date().toISOString().slice(0, 10));

  const [posts, setPosts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("logged-in"));

  const [preview, setPreview] = useState(false);
  const [post, setPost] = useState({
    name: "",
    src: "",
    title: "",
    note: "",
    date: "",
  });

  const fileRef = useRef(null);

  useEffect(() => {
    getAllPosts();
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

    fileRef.current.value = null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("note", note);
    formData.append("date", date);

    if (file) {
      axios.post(apiUrl + "/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("posts: " + response.data);
      })
      .catch((error) => console.error(error));

      setFile("");
      setNote("");
      setTitle("");

      getAllPosts();
      window.location.reload();
    }
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

  const getAllPosts = () => {
    console.log("getting all posts")
    axios
      .get(apiUrl + "/posts")
      .then((response) => {
        var sorted = response.data.sort((a, b) => b.id - a.id);
        console.log(sorted)
        setPosts(sorted);
      })
      .catch((error) => console.error(error));
  };

  const handlePost = (post) => {
    setPost({ ...post, src: post.data });
    openPreview();
  };

  const handleDelete = (name) => {
    axios
      .delete(apiUrl + `/posts/${name}`)
      .then((response) => {
        closePreview();
        getAllPosts();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
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
                  <a
                    href="https://www.facebook.com/profile.php?id=100090951083861"
                    target="_blank"
                    rel="noreferrer"
                  >
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
                        autoComplete="off"
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
                      ref={fileRef}
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
            {posts.map((post, index) => {
              return (
                <div
                  className="item post-container"
                  key={post.id}
                  onClick={() => handlePost(post)}
                >
                  <img
                    key={index}
                    className="post"
                    src={`${apiUrl}/images/${post.name}`}
                    alt=""
                  />
                </div>
              );
            })}

            {preview ? (
              <div className="preview">
                <i onClick={closePreview} className="fa fa-close close-btn"></i>
                <br></br>
                <div className="preview-body">
                  <div className="row">
                    <div className="col-md-6 post-section">
                      <img
                        className="preview-post"
                        src={`${apiUrl}/images/${post.name}`}
                        alt={title}
                      />
                    </div>
                    <div className="col-md-6 info-section">
                      <p className="date">{post.date}</p>
                      <h2 className="title">{post.title}</h2>
                      <p className="note">{post.note}</p>
                    </div>
                  </div>

                  {loggedIn ? (
                    <div>
                      <hr className="divider"></hr>
                      <div className="row">
                        <div
                          className="delete"
                          onClick={() => handleDelete(post.name)}
                        >
                          <i className="fa fa-trash delete-icon"></i>
                          <span className="delete-label">Delete this Post</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {posts.length < 1 ? (
            <div className="message-area">
              <div className="message">
                <h1>No Posts Found 🧐</h1>
                <br></br>
                <p>
                  There are no posts to display at the moment. Upload a post to
                  start seeing content here.
                </p>
                <p>Upload an Image, Add a Title and a Note.</p>
                <p>Click on a Post, Preview and Manage.</p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;

