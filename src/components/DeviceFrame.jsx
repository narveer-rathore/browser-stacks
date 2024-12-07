import { forwardRef, useEffect, useState, useCallback } from 'react';
import { createProxyUrl } from '../utils/proxyUrl';

const DeviceFrame = forwardRef(({ device, url, onScroll, index, scale }, ref) => {
  const [loadError, setLoadError] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const proxiedUrl = createProxyUrl(url);

  const frameStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: device.width,
    height: device.height,
    marginRight: `${device.width * (1 - scale)}px`,
    marginBottom: `${device.height * (1 - scale)}px`
  };

  const handleScroll = useCallback((event) => {
    if (isScrolling) return; // Prevent recursive scroll events

    const iframe = event.target;
    const scrollableWidth = iframe.documentElement.scrollWidth - iframe.clientWidth;
    const scrollableHeight = iframe.documentElement.scrollHeight - iframe.clientHeight;

    // Calculate scroll percentages
    const scrollPercent = {
      x: scrollableWidth > 0 ? iframe.scrollX / scrollableWidth : 0,
      y: scrollableHeight > 0 ? iframe.scrollY / scrollableHeight : 0
    };

    setIsScrolling(true);
    onScroll(index, scrollPercent);

    // Reset scrolling flag after a short delay
    setTimeout(() => setIsScrolling(false), 50);
  }, [index, onScroll, isScrolling]);

  useEffect(() => {
    if (ref?.current) {
      const iframe = ref.current;

      iframe.onload = function () {
        try {
          // Override user agent
          iframe.contentWindow.navigator.__defineGetter__('userAgent', function () {
            return device.userAgent;
          });

          // Add scroll listener to the iframe's content window
          iframe.contentWindow.addEventListener('scroll', handleScroll);
        } catch (e) {
          console.error('Error setting up iframe:', e);
        }
      };

      // Cleanup
      return () => {
        try {
          iframe.contentWindow?.removeEventListener('scroll', handleScroll);
        } catch (e) {
          console.error('Error cleaning up iframe:', e);
        }
      };
    }
  }, [ref, device.userAgent, handleScroll]);

  const handleIframeError = () => {
    setLoadError(true);
    console.error(`Failed to load: ${url} in device: ${device.name}`);
  };

  return (
    <div className="device-frame">
      <h3>{device.name} ({device.width}x{device.height})</h3>
      {url && !loadError ? (
        <div className="frame-container" style={frameStyle}>
          <iframe
            ref={ref}
            width={device.width}
            height={device.height}
            src={proxiedUrl}
            title={device.name}
            onError={handleIframeError}
          />
        </div>
      ) : loadError ? (
        <div className="error-container" style={frameStyle}>
          <p>Unable to load content.</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
        </div>
      ) : null}
    </div>
  );
});

export default DeviceFrame;
