import { useState, useEffect } from 'react';
import './CssInjector.css';

const CssInjector = ({ onInject, initialCss = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [css, setCss] = useState(initialCss);
  const [error, setError] = useState('');

  useEffect(() => {
    setCss(initialCss);
  }, [initialCss]);

  const handleInject = () => {
    try {
      // Basic CSS validation
      const styleEl = document.createElement('style');
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
      document.head.removeChild(styleEl);

      // If no error, inject the CSS
      setError('');
      onInject(css);
    } catch (err) {
      setError('Invalid CSS syntax');
    }
  };

  const handleReset = () => {
    setCss('');
    onInject('');
  };

  return (
    <div className="css-injector">
      {/* <button
        className="toggle-css-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide Custom CSS' : 'Custom CSS'}
      </button> */}

      <div className="css-editor">
        <div className="css-editor-header">
          <h3>Custom CSS</h3>
          <div className="css-editor-actions">
            <button
              className="reset-btn"
              onClick={handleReset}
              disabled={!css}
            >
              Reset
            </button>
            <button
              className="apply-btn"
              onClick={handleInject}
              disabled={!css || !!error}
            >
              Apply CSS
            </button>
          </div>
        </div>

        <textarea
          value={css}
          onChange={(e) => {
            setCss(e.target.value);
            setError('');
          }}
          placeholder="Enter custom CSS here...
Example:
body {
  background: #f0f0f0;
}
.header {
  border-color: red !important;
}"
          spellCheck="false"
        />

        {error && <div className="css-error">{error}</div>}

        <div className="css-help">
          <strong>Tips:</strong>
          <ul>
            <li>Use !important to override existing styles</li>
            <li>CSS will be applied to all device views</li>
            <li>Changes are preserved across sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CssInjector;
