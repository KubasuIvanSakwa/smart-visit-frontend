import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText); // Try parsing JSON
          onScan(parsed);
        } catch (err) {
          // fallback to raw string if not JSON
          onScan({ qrCode: decodedText });
        }
        scanner.clear(); // Optional: stop scanning after a scan
      },
      (errorMessage) => {
        console.warn('QR scan error:', errorMessage);
      }
    );

    return () => {
      scanner.clear().catch((e) => console.error('QR cleanup error', e));
    };
  }, [onScan]);

  return <div id="qr-reader" className="mt-4 rounded-lg overflow-hidden" />;
};

export default QRScanner;
