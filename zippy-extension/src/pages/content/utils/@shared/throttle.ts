const throttle = (fn: () => void, delay: number) => {
  let isThrottled = false;

  return () => {
    if (!isThrottled) {
      fn();
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
};

export default throttle;
