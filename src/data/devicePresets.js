export const devicePresets = {
  mobile: [
    {
      id: 'iphone-14-pro',
      name: 'iPhone 14 Pro',
      width: 393,
      height: 852,
      group: 'mobile',
      enabled: true,
      order: 0,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    },
    {
      id: 'pixel-7',
      name: 'Pixel 7',
      width: 412,
      height: 915,
      group: 'mobile',
      enabled: true,
      order: 1,
      userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    }
  ],
  tablet: [
    {
      id: 'ipad-pro-11',
      name: 'iPad Pro 11"',
      width: 834,
      height: 1194,
      group: 'tablet',
      enabled: true,
      order: 0,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    }
  ],
  desktop: [
    {
      id: 'desktop-1080p',
      name: 'Desktop 1080p',
      width: 1920,
      height: 1080,
      group: 'desktop',
      enabled: true,
      order: 0,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }
  ]
};

export const deviceGroups = [
  { id: 'mobile', name: 'Mobile Devices' },
  { id: 'tablet', name: 'Tablets' },
  { id: 'desktop', name: 'Desktop' }
];

export const getDefaultDevices = () => {
  return Object.values(devicePresets).flat();
};
