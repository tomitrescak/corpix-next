import { DependencyList, useEffect, useState } from 'react';

export function useAsyncMemo<T>(
  factory: () => Promise<T> | undefined | null,
  deps: DependencyList,
  initial: T = undefined as Any
): T {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    let cancel = false;
    const promise = factory();
    if (promise === undefined || promise === null) return;
    setVal({} as Any);
    promise.then(val => {
      if (!cancel && val !== initial) {
        setVal(val);
      }
    });
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return val;
}
