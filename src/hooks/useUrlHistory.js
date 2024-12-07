import { useState, useCallback } from 'react';
import { storage } from '../utils/storage';

const MAX_HISTORY_SIZE = 10;

export const useUrlHistory = () => {
  const [history, setHistory] = useState(storage.getUrlHistory());
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addUrl = useCallback((url) => {
    const newHistory = [url, ...history.filter(item => item !== url)]
      .slice(0, MAX_HISTORY_SIZE);

    setHistory(newHistory);
    setCurrentIndex(0);
    storage.setUrlHistory(newHistory);
  }, [history]);

  const goBack = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const goForward = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  return {
    history,
    currentUrl: history[currentIndex],
    canGoBack: currentIndex < history.length - 1,
    canGoForward: currentIndex > 0,
    goBack,
    goForward,
    addUrl
  };
};
