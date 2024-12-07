import { useState } from 'react';
import './DeviceManager.css';

const DeviceManager = ({ devices, onUpdateDevices, scale, onScaleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    width: '',
    height: '',
    userAgent: ''
  });

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.width || !newDevice.height) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedDevices = [
      ...devices,
      {
        id: Date.now().toString(),
        ...newDevice,
        enabled: true,
        order: devices.length,
        width: parseInt(newDevice.width),
        height: parseInt(newDevice.height)
      }
    ];
    onUpdateDevices(updatedDevices);
    setNewDevice({ name: '', width: '', height: '', userAgent: '' });
  };

  const handleEditDevice = (deviceId, field, value) => {
    const updatedDevices = devices.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          [field]: field === 'width' || field === 'height' ? parseInt(value) : value
        };
      }
      return device;
    });
    onUpdateDevices(updatedDevices);
  };

  const handleToggleDevice = (deviceId) => {
    const updatedDevices = devices.map(device => {
      if (device.id === deviceId) {
        return { ...device, enabled: !device.enabled };
      }
      return device;
    });
    onUpdateDevices(updatedDevices);
  };

  const handleDeleteDevice = (deviceId) => {
    const updatedDevices = devices
      .filter(device => device.id !== deviceId)
      .map((device, index) => ({ ...device, order: index }));
    onUpdateDevices(updatedDevices);
  };

  const handleMoveDevice = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === devices.length - 1)
    ) {
      return;
    }

    const newDevices = [...devices];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newDevices[index], newDevices[newIndex]] = [newDevices[newIndex], newDevices[index]];

    // Update order property
    const updatedDevices = newDevices.map((device, idx) => ({
      ...device,
      order: idx
    }));

    onUpdateDevices(updatedDevices);
  };

  return (
    <div className="device-manager">
      <div className="device-controls">
        <button
          className="manage-devices-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close Device Manager' : 'Manage Devices'}
        </button>

        <div className="scale-control">
          <label>Scale: </label>
          <input
            type="range"
            min="0.25"
            max="1"
            step="0.05"
            value={scale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          />
          <span>{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {isOpen && (
        <div className="device-manager-content">
          <div className="new-device-form">
            <h3>Add New Device</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Device Name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Width (px)"
                value={newDevice.width}
                onChange={(e) => setNewDevice({ ...newDevice, width: e.target.value })}
              />
              <input
                type="number"
                placeholder="Height (px)"
                value={newDevice.height}
                onChange={(e) => setNewDevice({ ...newDevice, height: e.target.value })}
              />
              <input
                type="text"
                placeholder="User Agent (optional)"
                value={newDevice.userAgent}
                onChange={(e) => setNewDevice({ ...newDevice, userAgent: e.target.value })}
              />
              <button
                className="add-device-btn"
                onClick={handleAddDevice}
                disabled={!newDevice.name || !newDevice.width || !newDevice.height}
              >
                Add Device
              </button>
            </div>
          </div>

          <div className="existing-devices">
            <h3>Manage Devices</h3>
            <div className="devices-list">
              {devices
                .sort((a, b) => a.order - b.order)
                .map((device, index) => (
                  <div key={device.id} className="device-item">
                    <div className="move-buttons">
                      <button
                        className="move-btn"
                        onClick={() => handleMoveDevice(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        className="move-btn"
                        onClick={() => handleMoveDevice(index, 'down')}
                        disabled={index === devices.length - 1}
                      >
                        ↓
                      </button>
                    </div>

                    <label className="device-toggle">
                      <input
                        type="checkbox"
                        checked={device.enabled}
                        onChange={() => handleToggleDevice(device.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>

                    <input
                      type="text"
                      value={device.name}
                      onChange={(e) => handleEditDevice(device.id, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      value={device.width}
                      onChange={(e) => handleEditDevice(device.id, 'width', e.target.value)}
                    />
                    <input
                      type="number"
                      value={device.height}
                      onChange={(e) => handleEditDevice(device.id, 'height', e.target.value)}
                    />
                    <input
                      type="text"
                      value={device.userAgent}
                      onChange={(e) => handleEditDevice(device.id, 'userAgent', e.target.value)}
                    />
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteDevice(device.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;
