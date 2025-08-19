import React from 'react';
import html2canvas from 'html2canvas';
import VisitorBadge from './VisitorBadge';

const BadgePage = () => {
  const handleDownload = async () => {
    const badge = document.getElementById('badge');
    if (!badge) return;

    try {
      const canvas = await html2canvas(badge, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'visitor_badge.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('html2canvas failed:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <VisitorBadge
        name="John Doe"
        host="Jane Smith"
        date={new Date().toLocaleDateString()}
      />

      <button
        onClick={handleDownload}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Download Badge
      </button>
    </div>
  );
};

export default BadgePage;
