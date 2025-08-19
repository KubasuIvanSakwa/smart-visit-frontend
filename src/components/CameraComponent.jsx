import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const CameraComponent = ({ setCapturedPhoto, capturedPhoto }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    if (!capturedPhoto) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setIsCameraReady(true);
          }
        })
        .catch((err) => {
          console.error('Error accessing camera: ', err);
          setIsCameraReady(false);
        });

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [capturedPhoto]);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn('Video or canvas not available');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get canvas context');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/png');
    setCapturedPhoto(imageDataURL);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setIsCameraReady(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center space-y-2">
      {!capturedPhoto ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl"
        />
      ) : (
        <img
          src={capturedPhoto}
          alt="Captured"
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl"
        />
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <button
        onClick={capturedPhoto ? retakePhoto : takePicture}
        className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-colors"
      >
        <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{capturedPhoto ? 'Retake Photo' : 'Take Photo'}</span>
      </button>
    </div>
  );
};

export default CameraComponent;
