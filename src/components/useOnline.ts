import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Prototype : état réseau via navigator.onLine sur le web, toujours en ligne ailleurs.
// En production : @react-native-community/netinfo (voir docs/architecture.md).
export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const update = () => setOnline(window.navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}
