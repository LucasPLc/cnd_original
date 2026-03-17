import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CNDMonitoramento from './pages/CNDMonitoramento';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyles = () => (
  <style>
    {`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `}
  </style>
);

function App() {
  return (
    <Router>
      <GlobalStyles />
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
