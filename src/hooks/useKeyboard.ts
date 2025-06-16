
import { useEffect, useCallback } from 'react';

export const useKeyboard = (onSpacePress: () => void) => {
  const handleSpacebarPress = useCallback(() => {
    onSpacePress();
  }, [onSpacePress]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleSpacebarPress();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleSpacebarPress]);
};
