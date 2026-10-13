import { useState, useEffect } from "react";

/**
 * PRODUCTION PATTERN: Network Connectivity & Online Status Hook
 *
 * In production streaming apps, network drops, mobile tunnel disconnects,
 * or airplane mode changes need to be caught gracefully.
 *
 * This hook listens to browser online/offline events so the app can switch
 * to cached/offline fallback datasets without displaying unhandled network errors.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export default useOnlineStatus;
