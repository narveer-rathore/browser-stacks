import { useState, useRef, useCallback } from 'react';
import { getInitialDevices, saveDevices } from './data/devices.js';
import { formatUrl } from './utils/urlUtils.js';
import DeviceView from './components/DeviceView/DeviceView';
import NavigationControls from './components/NavigationControls/NavigationControls';
import ScreenshotAll from './components/ScreenshotAll/ScreenshotAll';
import './App.css';
import Settings from './components/Settings/Settings.jsx';

function App() {
  const [devices, setDevices] = useState(getInitialDevices);
  const [activeUrl, setActiveUrl] = useState('');
  const [scale, setScale] = useState(1);
  const [customCss, setCustomCss] = useState(() => {
    return localStorage.getItem('custom-css') || '';
  });
  const deviceRefs = useRef([]);
  const [showSetting, setShowSettings] = useState(false);

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
        <NavigationControls onUrlChange={handleUrlChange}>
          <ScreenshotAll
            devices={devices}
            deviceRefs={deviceRefs}
          />
          <button
            className="manage-devices-btn"
            onClick={() => setShowSettings(true)}
          >
            <i className={`fas fa-gear`}></i>
          </button>
        </NavigationControls>
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

      {showSetting && <Settings
        tab={showSetting}
        onInject={handleCssInject}
        initialCss={customCss}
        devices={devices}
        onUpdateDevices={handleUpdateDevices}
        scale={scale}
        setShowSettings={setShowSettings}
        onScaleChange={setScale}
      />}
    </div>
  );
}

export default App;
