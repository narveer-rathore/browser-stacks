import { useState } from 'react';

const UnsupportedSiteWarning = ({ url }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="unsupported-warning">
      <p>
        Some websites may not load due to security restrictions.
        If a frame fails to load, try using the proxy server or open in a new tab.
      </p>
      <div className="warning-actions">
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open in New Tab
        </a>
        <button onClick={() => setDismissed(true)}>Dismiss</button>
      </div>
    </div>
  );
};

export default UnsupportedSiteWarning;
