
import { useState, useCallback } from 'react';

export const useHistory = <T,>(initialState: T) => {
  const [state, setState] = useState({
    history: [initialState],
    currentIndex: 0,
  });

  const { history, currentIndex } = state;

  const setCurrentState = useCallback((action: T | ((prevState: T) => T), overwrite = false) => {
    setState(prevState => {
      const currentState = prevState.history[prevState.currentIndex];
      const newState = typeof action === 'function' ? (action as (prevState: T) => T)(currentState) : action;

      // Prevent update if state is identical
      if (JSON.stringify(newState) === JSON.stringify(currentState)) {
        return prevState;
      }

      if (overwrite) {
        const newHistory = [...prevState.history];
        newHistory[prevState.currentIndex] = newState;
        return { ...prevState, history: newHistory };
      }

      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      newHistory.push(newState);

      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex > 0) {
        return { ...prevState, currentIndex: prevState.currentIndex - 1 };
      }
      return prevState;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex < prevState.history.length - 1) {
        return { ...prevState, currentIndex: prevState.currentIndex + 1 };
      }
      return prevState;
    });
  }, []);

  return {
    state: history[currentIndex],
    setState: setCurrentState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};