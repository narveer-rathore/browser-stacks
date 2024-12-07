// Access the combined stats passed from main process
const stats = JSON.parse(window.process.argv[window.process.argv.length - 1]);

// You can now access both browsers and devices:
// stats.browsers - for browser statistics
// stats.devices - for device statistics
