import { useState, useEffect } from 'react';

// Generic debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search hook with debounce
export function useSearch(query: string, delay = 300) {
  const debouncedQuery = useDebounce(query, delay);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [query, debouncedQuery]);

  return { debouncedQuery, isSearching };
}
