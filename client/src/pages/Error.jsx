import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Error = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          "url('https://images.squarespace-cdn.com/content/v1/581e29362994ca6b3ada6ad6/a0d40b2d-7c14-4ddb-bd90-c00ab642b0a7/SS+good+pics+%287%29.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className="container text-center">
        <div
          className="p-5 rounded-4 shadow-lg mx-auto"
          style={{
            maxWidth: '500px',
            backgroundColor: 'rgba(0,0,0,0.85)', // black overlay
            color: '#FFD700', // yellow text
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <h1 className="mb-3" style={{ fontWeight: 700 }}>
            Oops! Something went wrong
          </h1>
          <p className="mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>
            It looks like you need to log in first to access this page.
          </p>
          <Link
            to="/login"
            className="btn btn-lg"
            style={{
              backgroundColor: '#FFD700', // yellow button
              color: '#000', // black text
              fontWeight: 600,
              padding: '10px 40px',
              borderRadius: '12px',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#FFC107')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FFD700')}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
