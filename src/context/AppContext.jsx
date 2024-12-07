import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage, defaultPreferences } from '../utils/storage';
import { devicePresets } from '../data/devicePresets';

const AppContext = createContext(null);

const initialState = {
  devices: storage.getDevices(),
  preferences: storage.getPreferences(),
  urlHistory: storage.getUrlHistory(),
  customCss: storage.getCustomCss(),
  currentUrl: '',
  activeGroup: defaultPreferences.lastUsedGroup
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_DEVICES':
      return { ...state, devices: action.payload };

    case 'SET_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };

    case 'ADD_URL_TO_HISTORY':
      const newHistory = [action.payload, ...state.urlHistory.slice(0, 9)];
      return { ...state, urlHistory: newHistory, currentUrl: action.payload };

    case 'SET_CUSTOM_CSS':
      return { ...state, customCss: action.payload };

    case 'SET_ACTIVE_GROUP':
      return { ...state, activeGroup: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist state changes
  useEffect(() => {
    storage.setDevices(state.devices);
  }, [state.devices]);

  useEffect(() => {
    storage.setPreferences(state.preferences);
  }, [state.preferences]);

  useEffect(() => {
    storage.setUrlHistory(state.urlHistory);
  }, [state.urlHistory]);

  useEffect(() => {
    storage.setCustomCss(state.customCss);
  }, [state.customCss]);

  const value = {
    state,
    dispatch,
    actions: {
      updateDevices: (devices) =>
        dispatch({ type: 'SET_DEVICES', payload: devices }),

      updatePreferences: (prefs) =>
        dispatch({ type: 'SET_PREFERENCES', payload: prefs }),

      addUrlToHistory: (url) =>
        dispatch({ type: 'ADD_URL_TO_HISTORY', payload: url }),

      setCustomCss: (css) =>
        dispatch({ type: 'SET_CUSTOM_CSS', payload: css }),

      setActiveGroup: (group) =>
        dispatch({ type: 'SET_ACTIVE_GROUP', payload: group }),

      importConfig: async (file) => {
        try {
          const config = await file.text();
          const { devices, preferences } = JSON.parse(config);
          if (devices) dispatch({ type: 'SET_DEVICES', payload: devices });
          if (preferences) dispatch({ type: 'SET_PREFERENCES', payload: preferences });
        } catch (error) {
          console.error('Error importing config:', error);
          throw error;
        }
      },

      exportConfig: () => {
        const config = {
          devices: state.devices,
          preferences: state.preferences
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'responsive-viewer-config.json';
        a.click();
        URL.revokeObjectURL(url);
      },

      resetToDefaults: () => {
        dispatch({ type: 'SET_DEVICES', payload: devicePresets.mobile });
        dispatch({ type: 'SET_PREFERENCES', payload: defaultPreferences });
      }
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
