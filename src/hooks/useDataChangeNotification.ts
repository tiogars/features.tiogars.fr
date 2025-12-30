import { useEffect, useRef, useState, useCallback } from 'react';

const DATA_CHANGE_KEY = 'lastDataChangeTimestamp';

// Save the data change timestamp to localStorage
function saveDataChangeTimestamp(): void {
  localStorage.setItem(DATA_CHANGE_KEY, Date.now().toString());
}

interface UseDataChangeNotificationResult {
  showNotification: boolean;
  dismissNotification: () => void;
}

/**
 * Custom hook to detect when new data has been added and show a notification
 * Compares the total count of entities to detect changes
 */
export function useDataChangeNotification(
  featuresCount: number,
  repositoriesCount: number,
  appsCount: number
): UseDataChangeNotificationResult {
  const [showNotification, setShowNotification] = useState(false);
  const previousTotalRef = useRef<number | null>(null);
  const isFirstLoadRef = useRef(true);

  // Calculate the current total
  const currentTotal = featuresCount + repositoriesCount + appsCount;

  useEffect(() => {
    // Skip on first load
    if (isFirstLoadRef.current) {
      previousTotalRef.current = currentTotal;
      isFirstLoadRef.current = false;
      return;
    }

    // Check if data has been added
    const hasDataIncreased = previousTotalRef.current !== null && currentTotal > previousTotalRef.current;
    previousTotalRef.current = currentTotal;
    
    if (hasDataIncreased) {
      // Use setTimeout to avoid synchronous state update in effect
      // This is a standard React pattern to defer state updates
      const timerId = setTimeout(() => {
        setShowNotification(true);
        saveDataChangeTimestamp();
      }, 0);

      return () => clearTimeout(timerId);
    }
  }, [currentTotal]);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return {
    showNotification,
    dismissNotification,
  };
}
