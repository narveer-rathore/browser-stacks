import { useUrlHistory } from '../../hooks/useUrlHistory';
import './NavigationControls.css';
import { toggleSettings } from "../../utils/settings";

const NavigationControls = ({ onUrlChange, children }) => {
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
      <div className='logo'>
        <img src='/assets/browserstacks-logo.jpg'></img>
      </div>
      <div className="nav-buttons">
        <button
          onClick={() => handleNavigation('back')}
          disabled={!canGoBack}
          title="Go Back"
        >
          <i className='fas fa-arrow-left'></i>
        </button>
        <button
          onClick={() => handleNavigation('forward')}
          disabled={!canGoForward}
          title="Go Forward"
        >
          <i className='fas fa-arrow-right'></i>
        </button>
      </div>

      <form onSubmit={handleUrlSubmit} className="url-form">
        <input
          type="text"
          name="url"
          list="url-history"
          placeholder="Enter URL (e.g., google.com)"
          className="url-input"
        />
        <button type="submit" className="load-button">
          <i className="fa-solid fa-globe"></i>
        </button>
        {children}
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
