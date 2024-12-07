const { ipcRenderer } = require('electron');

// Forward scroll events to main process
window.addEventListener('message', (event) => {
  if (event.data.type === 'SCROLL_SYNC') {
    ipcRenderer.sendToHost(event.data);
  }
});

// Inject custom styles for viewport simulation
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);
});
