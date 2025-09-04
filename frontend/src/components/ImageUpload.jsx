import React, { useEffect } from 'react';
import axios from 'axios';

function ImageUpload({getFunction, getValue}) {
  
  const fetchImages = async () => {
    const res = await axios.get('http://localhost:5000/upload/images');
    getFunction(res.data);
  };

  useEffect(() => {
    
    handleUpload()
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', getValue);

    await axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    fetchImages(); 
  };

  return (
    <div>
      <h2>Upload Image</h2>

      
    </div>
  );
}

export default ImageUpload;
