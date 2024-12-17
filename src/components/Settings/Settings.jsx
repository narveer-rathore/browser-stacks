import "./Settings.css";
import DeviceManager from '../DeviceManager/DeviceManager';
import CssInjector from '../CssInjector/CssInjector';

const TABS = [
  {
    id: "devices",
    name: "Devices"
  },
  {
    id: "scripts",
    name: "Scripts"
  },
  {
    id: "files",
    name: "Files"
  }
]
const Settings = ({ setShowSettings, tab, devices, scale, handleUpdateDevices, setScale, handleCssInject, customCss }) => {
  return <div className='settings'>
    <i className='fas fa-close' onClick={() => setShowSettings('')}></i>
    <ul className='setting-tabs'>
      {TABS.map((t) => {
        return <li id={t.id}>{t.name}</li>
      })}
    </ul>
    <div>
      <DeviceManager
        devices={devices}
        onUpdateDevices={handleUpdateDevices}
        scale={scale}
        setShowSettings={setShowSettings}
        onScaleChange={setScale}
      />
      <CssInjector
        onInject={handleCssInject}
        initialCss={customCss}
      />
    </div>
  </div>

}

export default Settings;
