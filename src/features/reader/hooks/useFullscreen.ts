import { useState, useCallback, useEffect } from 'react';

export function useFullscreen(targetRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enter = useCallback(() => {
    const el = targetRef.current ?? document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ('webkitRequestFullscreen' in el) {
      (el as HTMLElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
    }
  }, [targetRef]);

  const exit = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ('webkitExitFullscreen' in document) {
      (document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen();
    }
  }, []);

  const toggle = useCallback(() => {
    isFullscreen ? exit() : enter();
  }, [isFullscreen, enter, exit]);

  // Sync state with browser fullscreen change events
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  return { isFullscreen, enter, exit, toggle };
}
