import { useState, useEffect } from "react";

/**
 * PRODUCTION PATTERN: Custom Debounce Hook
 *
 * In real-world production web apps, sending an API request on every single
 * keystroke floods the backend server, risks hitting rate limits (e.g., TMDB 429 Too Many Requests),
 * and creates race conditions where earlier slow responses overwrite newer ones.
 *
 * This hook delays updating the debounced value until the user stops typing
 * for the specified delay period (default: 400ms).
 *
 * @param {any} value - The input value to debounce (e.g., search term)
 * @param {number} delay - Delay in milliseconds before updating value
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes (user continues typing) or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
