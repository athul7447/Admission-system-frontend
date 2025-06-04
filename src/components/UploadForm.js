import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    axios.get('http://localhost:8000/api/admissions/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUsers(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedUserId(res.data.data[0].id);
      }
    })
    .catch(err => {
      console.error('User fetch error:', err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); // ✅ Fresh read
    if (!file || !selectedUserId) return;

    const formData = new FormData();
    formData.append('user_id', selectedUserId);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/admissions/send-offer-letter', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      if (response.data.status) {
        setMessage("Upload successful");
      } else {
        setMessage("Upload failed");
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage("Upload error");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <label>Select User:</label>
        <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>

        <br /><br />
        <label>Choose File:</label>
        <input type="file" onChange={e => setFile(e.target.files[0])} />

        <br /><br />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;
