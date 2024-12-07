import { useUrlHistory } from '../hooks/useUrlHistory';
import './NavigationControls.css';

const NavigationControls = ({ onUrlChange }) => {
  const {
    history,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    addUrl
  } = useUrlHistory();

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    addUrl(url);
    onUrlChange(url);
  };

  const handleNavigation = (direction) => {
    const url = direction === 'back' ? goBack() : goForward();
    if (url) onUrlChange(url);
  };

  return (
    <div className="navigation-controls">
      <div className="nav-buttons">
        <button
          onClick={() => handleNavigation('back')}
          disabled={!canGoBack}
          title="Go Back"
        >
          ←
        </button>
        <button
          onClick={() => handleNavigation('forward')}
          disabled={!canGoForward}
          title="Go Forward"
        >
          →
        </button>
      </div>

      <form onSubmit={handleUrlSubmit} className="url-form">
        <input
          type="text"
          name="url"
          list="url-history"
          placeholder="Enter URL (e.g., example.com)"
          className="url-input"
        />
        <button type="submit" className="load-button">
          Load
        </button>
      </form>

      <datalist id="url-history">
        {history.map((url, index) => (
          <option key={index} value={url} />
        ))}
      </datalist>
    </div>
  );
};

export default NavigationControls;
