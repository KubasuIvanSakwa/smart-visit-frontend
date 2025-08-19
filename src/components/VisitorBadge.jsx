import React from 'react';

const VisitorBadge = ({ name, host, date }) => {
  return (
    <div
      id="badge"
      style={{
        width: '300px',
        height: '180px',
        padding: '16px',
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '1px solid #ccc',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          backgroundColor: '#007BFF',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center',
          padding: '4px',
          marginBottom: '12px',
        }}
      >
        VISITOR
      </div>
      <div style={{ lineHeight: '1.6', fontSize: '14px' }}>
        <div><strong>Name:</strong> {name}</div>
        <div><strong>Visiting:</strong> {host}</div>
        <div><strong>Date:</strong> {date}</div>
      </div>
    </div>
  );
};

export default VisitorBadge;
