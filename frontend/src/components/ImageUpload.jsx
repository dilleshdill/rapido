import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const res = await axios.get('http://localhost:5000/upload/images');
    setImages(res.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    await axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    fetchImages(); // refresh image list
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <h3>Images:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.filename}
            width={200}
            style={{ margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageUpload;
