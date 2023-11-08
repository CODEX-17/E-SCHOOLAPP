import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ChatPage = () => {

  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/get-image')
    .then((response) => {
      setImageURL(response.config.url);
      console.log(imageURL)
    });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('image', file);
    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const show = () => {
    console.log(imageURL)
  }

  return (
    <div>
      <h1>Image Upload</h1>
      <input type="file" accept="image/*"  name='image' onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>

      <div>
      <h2>Image Display</h2>
      <img src={imageURL} alt="Uploaded Image" />
      <button onClick={show}>SHOW</button>
      </div>

    </div>
  );
}

export default ChatPage