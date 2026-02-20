import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < MOBILE_BREAKPOINT);
    };

    // initial check
    update();

    // listen for changes (rotation, resize)
    const subscription = Dimensions.addEventListener('change', update);

    return () => {
      subscription.remove();
    };
  }, []);

  return isMobile;
}