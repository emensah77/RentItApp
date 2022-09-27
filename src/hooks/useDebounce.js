import { useEffect, useState } from "react";

export default function useDebounce(value, wait = 500) {
    const [debounceValue, setDebounceValue] = useState(value);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebounceValue(value);
      }, wait);
      return () => clearTimeout(timer); // cleanup when unmounted
    }, [value, wait]);
  
    return debounceValue;
  }