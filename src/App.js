import React, { useState } from 'react';
import Login from './components/Login';
import UploadForm from './components/UploadForm';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  console.log(token);
  return (
    <div>
      {token ? <UploadForm /> : <Login onLogin={setToken} />}
    </div>
  );
};

export default App;
