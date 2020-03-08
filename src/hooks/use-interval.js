import { useRef, useEffect } from 'react';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  });

  // set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    const id = window.setInterval(tick, delay);
    return () => window.clearInterval(id);
  }, [delay]);
};

export default useInterval;
