import { useRef, useEffect, useMemo } from "react";

/**
 * Simplified version of useDebouncedCallack from use-debounce library.
 * Source: https://www.npmjs.com/package/use-debounce#debounced-callbacks
 */
export function useDebouncedCallback(func, wait) {
  const lastCallTime = useRef(null);
  const lastInvokeTime = useRef(0);
  const firstInvokeTime = useRef(0);
  const timerId = useRef(null);
  const lastArgs = useRef([]);
  const lastThis = useRef();
  const result = useRef();
  const funcRef = useRef(func);
  const mounted = useRef(true);
  // Always keep the latest version of debounce callback, with no wait time.
  funcRef.current = func;

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const debounced = useMemo(() => {
    const invokeFunc = (time) => {
      const args = lastArgs.current;
      const thisArg = lastThis.current;
      lastArgs.current = lastThis.current = null;
      lastInvokeTime.current = time;
      firstInvokeTime.current = firstInvokeTime.current || time;

      return (result.current = funcRef.current.apply(thisArg, args));
    };

    const startTimer = (pendingFunc, wait) => {

      timerId.current = setTimeout(pendingFunc, wait);
    };

    const shouldInvoke = (time) => {
      if (!mounted.current) return false;

      const timeSinceLastCall = time - lastCallTime.current;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (
        !lastCallTime.current ||
        timeSinceLastCall >= wait ||
        timeSinceLastCall < 0
      );
    };

    const trailingEdge = (time) => {
      timerId.current = null;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (lastArgs.current) {
        return invokeFunc(time);
      }

      lastArgs.current = lastThis.current = null;
      return result.current;
    };

    const timerExpired = () => {
      const time = Date.now();

      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // https://github.com/xnimorz/use-debounce/issues/97
      if (!mounted.current) {
        return;
      }
      // Remaining wait calculation
      const timeSinceLastCall = time - lastCallTime.current;

      const timeWaiting = wait - timeSinceLastCall;
      const remainingWait = timeWaiting;

      // Restart the timer
      startTimer(timerExpired, remainingWait);
    };

    const func = (...args) => {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgs.current = args;
      lastThis.current = this;
      lastCallTime.current = time;

      if (isInvoking) {
        if (!timerId.current && mounted.current) {
          // Reset any `maxWait` timer.
          lastInvokeTime.current = lastCallTime.current;
          // Start the timer for the trailing edge.
          startTimer(timerExpired, wait);
          return result.current;
        }
      }
      if (!timerId.current) {
        startTimer(timerExpired, wait);
      }
      return result.current;
    };

    func.cancel = () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      lastInvokeTime.current = 0;
      lastArgs.current =
        lastCallTime.current =
        lastThis.current =
        timerId.current =
          null;
    };

    func.isPending = () => {
      return !!timerId.current;
    };

    func.flush = () => {
      return !timerId.current ? result.current : trailingEdge(Date.now());
    };

    return func;
  }, [wait]);
  return debounced;
}
