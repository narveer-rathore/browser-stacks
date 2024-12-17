import { useState } from 'react';
import { captureScreenshot } from '../../utils/screenshot';
import './ScreenshotAll.css';

const ScreenshotAll = ({ devices, deviceRefs }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleCaptureAll = async () => {
    try {
      setIsCapturing(true);
      setError(null);
      setProgress(0);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const enabledDevices = devices.filter(device => device.enabled);

      // Create a zip folder
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const folder = zip.folder(`screenshots-${timestamp}`);

      // Capture screenshots sequentially
      for (let i = 0; i < enabledDevices.length; i++) {
        const device = enabledDevices[i];
        const webview = deviceRefs.current[i]?.getWebview();

        if (webview) {
          try {
            const screenshot = await captureScreenshot(webview);
            folder.file(`${device.name}-${timestamp}.png`, screenshot.buffer);
          } catch (err) {
            console.error(`Failed to capture ${device.name}:`, err);
          }
        }

        setProgress(((i + 1) / enabledDevices.length) * 100);
      }

      // Generate and download zip
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `screenshots-${timestamp}.zip`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setError('Failed to capture screenshots');
      console.error(err);
    } finally {
      setIsCapturing(false);
      setProgress(0);
    }
  };

  const enabledCount = devices.filter(device => device.enabled).length;

  return (
    <div className="screenshot-all">
      <button
        className={`manage-devices-btn ${isCapturing ? 'capturing' : ''}`}
        onClick={handleCaptureAll}
        disabled={isCapturing || enabledCount === 0}
        title={enabledCount === 0 ? 'No devices enabled' : `Capture all ${enabledCount} devices`}
      >
        {isCapturing ? (
          <span className="capture-progress">
            Capturing... {Math.round(progress)}%
          </span>
        ) : (
          <i className='fas fa-camera'></i>
        )}
      </button>

      {error && (
        <div className="screenshot-all-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default ScreenshotAll;
