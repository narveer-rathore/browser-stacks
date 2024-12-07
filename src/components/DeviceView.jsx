import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { formatUrl } from '../utils/urlUtils';
import Screenshot from './Screenshot';
import DeviceDataCollector from './DeviceDataCollector';
import './DeviceView.css';

const DeviceView = forwardRef(({ device, url, onScroll, index, scale, customCss }, ref) => {
  const webviewRef = useRef(null);
  const containerRef = useRef(null);

  // Expose webview methods to parent
  useImperativeHandle(ref, () => ({
    getWebview: () => webviewRef.current
  }));

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoad = () => {
      // Set user agent
      webview.setUserAgent(device.userAgent);

      // Inject custom CSS if provided
      if (customCss) {
        webview.executeJavaScript(`
          (function() {
            const style = document.createElement('style');
            style.id = 'custom-css';
            style.textContent = ${JSON.stringify(customCss)};

            // Remove existing custom CSS if any
            const existingStyle = document.getElementById('custom-css');
            if (existingStyle) {
              existingStyle.remove();
            }

            document.head.appendChild(style);
          })();
        `);
      }
    };

    webview.addEventListener('dom-ready', handleLoad);
    return () => {
      webview.removeEventListener('dom-ready', handleLoad);
    };
  }, [device.userAgent, customCss]);

  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: device.width,
    height: device.height,
    marginRight: `${device.width * (1 - scale)}px`,
    marginBottom: `${device.height * (1 - scale)}px`
  };

  return (
    <div className="device-view">
      <div className="device-header">
        <div className="device-info">
          <h3>{device.name}</h3>
          <span className="device-dimensions">
            {device.width} × {device.height}
          </span>
        </div>
        <div className="device-actions">
          <Screenshot
            webview={webviewRef.current}
            deviceName={device.name}
          />
          <DeviceDataCollector
            webview={webviewRef.current}
            device={device}
          />
        </div>
      </div>

      <div className="device-container" style={containerStyle} ref={containerRef}>
        <webview
          ref={webviewRef}
          src={url ? formatUrl(url) : 'about:blank'}
          style={{
            width: device.width,
            height: device.height
          }}
          preload="../preload/webview-preload.js"
        />
      </div>
    </div>
  );
});

export default DeviceView;
