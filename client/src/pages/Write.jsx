import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const Write = () => {
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || '');
  const [value, setValue] = useState(state?.desc || '');
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || '');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid image file');
    }
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(
        'http://localhost:8800/api/upload',
        formData
      );
      console.log(res.data);
      return res.data.url; // Cloudinary URL returned by the API
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const imgUrl = file ? await upload() : state?.img || '';
      const postPayload = {
        title,
        desc: value,
        cat,
        img: imgUrl, // Use the Cloudinary URL
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      };
      const token = localStorage.getItem('token');

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      state
        ? await axios.put(
            `http://localhost:8800/api/posts/${state.id}`,
            postPayload,
            headers
          )
        : await axios.post(
            'http://localhost:8800/api/posts/',
            postPayload,
            headers
          );

      navigate('/');
    } catch (err) {
      setError('Failed to submit the post');
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: 'none' }}
            type="file"
            id="file"
            onChange={handleFileChange}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === 'art'}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === 'science'}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === 'technology'}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === 'cinema'}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === 'design'}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === 'food'}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
