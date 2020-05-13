// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce<T extends Function>(func: T, wait: number, immediate?: boolean): T {
  let timeout: Any;
  return function (this: any, ...args: any[]) {
    var later = () => {
      timeout = null;
      func.apply(this, args);
    };

    if (immediate) {
      immediate = false;
      later();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
  } as Any;
}

export default debounce;
