import { useState, useRef, useCallback } from 'react';
import { getInitialDevices, saveDevices } from './data/devices.js';
import { formatUrl } from './utils/urlUtils.js';
import DeviceView from './components/DeviceView.jsx';
import DeviceManager from './components/DeviceManager.jsx';
import NavigationControls from './components/NavigationControls.jsx';
import CssInjector from './components/CssInjector.jsx';
import ScreenshotAll from './components/ScreenshotAll.jsx';
import './App.css';

function App() {
  const [devices, setDevices] = useState(getInitialDevices);
  const [activeUrl, setActiveUrl] = useState('');
  const [scale, setScale] = useState(1);
  const [customCss, setCustomCss] = useState(() => {
    return localStorage.getItem('custom-css') || '';
  });
  const deviceRefs = useRef([]);

  const handleUrlChange = useCallback((url) => {
    const formattedUrl = formatUrl(url);
    setActiveUrl(formattedUrl);
  }, []);

  const handleUpdateDevices = useCallback((updatedDevices) => {
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
  }, []);

  const handleScroll = useCallback((sourceIndex, scrollPercent) => {
    deviceRefs.current.forEach((ref, index) => {
      if (index !== sourceIndex) {
        const webview = ref?.getWebview();
        if (webview) {
          webview.executeJavaScript(`
            const maxX = document.documentElement.scrollWidth - window.innerWidth;
            const maxY = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo(
              maxX * ${scrollPercent.x},
              maxY * ${scrollPercent.y}
            );
          `);
        }
      }
    });
  }, []);

  const handleCssInject = useCallback((css) => {
    setCustomCss(css);
    localStorage.setItem('custom-css', css);
  }, []);

  return (
    <div className="app">
      <div className="app-header">
        <NavigationControls onUrlChange={handleUrlChange} />

        <div className="controls-row">
          <div className="left-controls">
            <DeviceManager
              devices={devices}
              onUpdateDevices={handleUpdateDevices}
              scale={scale}
              onScaleChange={setScale}
            />
            <CssInjector
              onInject={handleCssInject}
              initialCss={customCss}
            />
          </div>

          <ScreenshotAll
            devices={devices}
            deviceRefs={deviceRefs}
          />
        </div>
      </div>

      <div className="devices-container">
        {devices
          .filter(device => device.enabled)
          .sort((a, b) => a.order - b.order)
          .map((device, index) => (
            <DeviceView
              key={device.id}
              device={device}
              url={activeUrl}
              onScroll={handleScroll}
              index={index}
              scale={scale}
              customCss={customCss}
              ref={(el) => (deviceRefs.current[index] = el)}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
