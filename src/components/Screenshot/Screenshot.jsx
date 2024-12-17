import { useState } from 'react';
import { captureScreenshot, downloadScreenshot } from '../../utils/screenshot';
import './Screenshot.css';

const Screenshot = ({ webview, deviceName }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleCapture = async () => {
    try {
      setIsCapturing(true);
      setError(null);

      const screenshot = await captureScreenshot(webview);
      setPreview(screenshot.preview);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${deviceName}-${timestamp}.png`;

      downloadScreenshot(screenshot.buffer, filename);
    } catch (err) {
      setError('Failed to capture screenshot');
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
    setTimeout(() => {
      setPreview(null);
    }, 5000)
  };

  return (
    <div className="screenshot-control">
      <button
        className={`screenshot-btn ${isCapturing ? 'capturing' : ''}`}
        onClick={handleCapture}
        disabled={isCapturing || !webview}
      >
        <i className='fas fa-camera'></i>
      </button>

      {error && (
        <div className="screenshot-error">
          {error}
        </div>
      )}

      {preview && (
        <div className="screenshot-preview">
          <img src={preview} alt="Screenshot preview" />
        </div>
      )}
    </div>
  );
};

export default Screenshot;
