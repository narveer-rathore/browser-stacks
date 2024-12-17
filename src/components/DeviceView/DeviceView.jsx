import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { formatUrl } from '../../utils/urlUtils';
import Screenshot from '../Screenshot/Screenshot';
import DeviceDataCollector from '../DeviceDataCollector/DeviceDataCollector';
import './DeviceView.css';

const DeviceView = forwardRef(({ device, url, onScroll, index, scale, customCss }, ref) => {
  const webviewRef = useRef(null);
  const containerRef = useRef(null);
  const [webviewUrl, setWebviewUrl] = useState('about:blank');
  const [canGoBack, setCanGoBack] = useState(false);
  const [muted, setMuted] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Expose webview methods to parent
  useImperativeHandle(ref, () => ({
    getWebview: () => webviewRef.current
  }));

  const setBackForwardState = () => {
    setCanGoBack(webviewRef.current.canGoBack());
    setCanGoForward(webviewRef.current.canGoForward());
  }
  const didNavigate = ({ url }) => {
    setWebviewUrl(url);
    setBackForwardState();
  }
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

    webview.addEventListener('did-navigate-in-page', didNavigate);
    webview.addEventListener('dom-ready', handleLoad);
    return () => {
      webview.removeEventListener('dom-ready', handleLoad);
      webview.removeEventListener('did-navigate-in-page', didNavigate);
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

  const handleNavigation = (direction) => {
    const webview = webviewRef.current;
    if (!webview) return;
    if (direction === 'back' && webview.canGoBack()) {
      webview.goBack();
    } else if (direction === 'forward' && webview.canGoForward()) {
      webview.goForward();
    }
  };

  const toggleMute = () => {
    const webview = webviewRef.current;
    if (!webview) return;
    const nextMutedState = !webview.isAudioMuted();
    setMuted(nextMutedState);
    webview.setAudioMuted(nextMutedState);
  }

  return (
    <div className="device-view">
      <div className="device-header">
        <div className="device-info">
          <h3>{device.name}<span className="device-dimensions">
            {device.width} × {device.height}
          </span></h3>
          <div className="tab-controls">
            <button
              className={`screenshot-btn `}
              onClick={toggleMute}
            >
              <i style={{ minWidth: 25, display: 'inline-block' }} className={`fas ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
            </button>
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
        <div className="device-actions">
          <div className='device-controls'>
            <button
              onClick={() => handleNavigation('back')}
              title="Go Back"
              disabled={!canGoBack}
            >
              <i className='fas fa-arrow-left'></i>
            </button>
            <button
              onClick={() => handleNavigation('forward')}
              title="Go Forward"
              disabled={!canGoForward}
            >
              <i className='fas fa-arrow-right'></i>
            </button>
          </div>
          <input value={webviewUrl} className='webview-url' title={webviewUrl} readOnly />
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
