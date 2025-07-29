import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CNDMonitoramento from './pages/CNDMonitoramento';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<CNDMonitoramento />} />
      </Routes>
    </Router>
  );
}

export default App;
