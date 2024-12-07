import { useState } from 'react';
import { captureScreenshot } from '../utils/screenshot';
import './DeviceDataCollector.css';

const DeviceDataCollector = ({ webview, device }) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState(null);

  const collectDeviceData = async () => {
    try {
      setIsCollecting(true);
      setError(null);

      // Create timestamp for filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const baseFilename = `${device.name}-${timestamp}`;

      // Initialize zip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // 1. Capture Screenshot
      const screenshot = await captureScreenshot(webview);
      zip.file(`${baseFilename}-screenshot.png`, screenshot.buffer);

      // 2. Collect Console Logs
      const consoleLogs = await webview.executeJavaScript(`
        (function() {
          const logs = [];
          const originalConsole = { ...console };

          ['log', 'info', 'warn', 'error'].forEach(level => {
            console[level] = (...args) => {
              logs.push({
                level,
                timestamp: new Date().toISOString(),
                message: args.map(arg => {
                  try {
                    return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                  } catch (e) {
                    return '[Complex Object]';
                  }
                }).join(' ')
              });
              originalConsole[level](...args);
            };
          });

          return JSON.stringify(logs);
        })();
      `);
      zip.file(`${baseFilename}-console.json`, consoleLogs);

      // 3. Collect Network Requests
      const networkRequests = await webview.executeJavaScript(`
        (function() {
          const requests = performance.getEntriesByType('resource').map(entry => ({
            name: entry.name,
            entryType: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration,
            initiatorType: entry.initiatorType,
            nextHopProtocol: entry.nextHopProtocol,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize
          }));
          return JSON.stringify(requests);
        })();
      `);
      zip.file(`${baseFilename}-network.json`, networkRequests);

      // 4. Collect Browser Metadata
      const metadata = await webview.executeJavaScript(`
        (function() {
          return JSON.stringify({
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
              devicePixelRatio: window.devicePixelRatio
            },
            timing: performance.timing.toJSON(),
            deviceMemory: navigator.deviceMemory,
            hardwareConcurrency: navigator.hardwareConcurrency,
            url: window.location.href,
            title: document.title
          });
        })();
      `);
      zip.file(`${baseFilename}-metadata.json`, metadata);

      // 5. Create README
      const readme = `Device Data Collection
Generated: ${new Date().toISOString()}
Device: ${device.name}
Resolution: ${device.width}x${device.height}

Files included:
- screenshot.png: Current view of the page
- console.json: Console logs collected during the session
- network.json: Network request performance data
- metadata.json: Browser and environment information

For support: your@email.com`;

      zip.file('README.txt', readme);

      // Generate and download zip
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFilename}-data.zip`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setError('Failed to collect device data');
      console.error('Data collection error:', err);
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <div className="device-data-collector">
      <button
        className={`collect-data-btn ${isCollecting ? 'collecting' : ''}`}
        onClick={collectDeviceData}
        disabled={isCollecting || !webview}
        title="Download device data (Screenshot, Console, Network)"
      >
        {isCollecting ? (
          <span className="collecting-text">Collecting...</span>
        ) : (
          <span className="collect-text">📥 Download Data</span>
        )}
      </button>

      {error && (
        <div className="collector-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeviceDataCollector;
