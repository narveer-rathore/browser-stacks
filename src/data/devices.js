export const defaultDevices = [
  {
    id: '1',
    name: 'iPhone SE',
    width: 375,
    height: 667,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    enabled: true,
    order: 0
  },
  {
    id: '2',
    name: 'iPhone 12 Pro',
    width: 390,
    height: 844,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    enabled: true,
    order: 1
  },
  {
    id: '3',
    name: 'iPad',
    width: 768,
    height: 1024,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    enabled: true,
    order: 2
  },
  {
    id: '4',
    name: 'Desktop',
    width: 1280,
    height: 800,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    enabled: true,
    order: 3
  }
];

export const getInitialDevices = () => {
  const savedDevices = localStorage.getItem('devices');
  if (!savedDevices) {
    localStorage.setItem('devices', JSON.stringify(defaultDevices));
    return defaultDevices;
  }
  return JSON.parse(savedDevices);
};

export const saveDevices = (devices) => {
  localStorage.setItem('devices', JSON.stringify(devices));
};
