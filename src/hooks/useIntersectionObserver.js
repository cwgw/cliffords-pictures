import React from 'react';

let io;
const listeners = new WeakMap();

function getIO() {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (listeners.has(entry.target)) {
            const cb = listeners.get(entry.target);
            // Edge doesn't currently support isIntersecting,
            // so also test for an intersectionRatio > 0
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              cb();
            }
          }
        });
      },
      { rootMargin: `300px` }
    );
  }

  return io;
}

const listenToIntersections = (el, cb) => {
  const observer = getIO();

  if (observer) {
    observer.observe(el);
    listeners.set(el, cb);
  }

  return () => {
    observer.unobserve(el);
    listeners.delete(el);
  };
};

const useIntersectionObserver = cb => {
  const [ref, setRef] = React.useState();

  React.useLayoutEffect(() => {
    if (ref) {
      listenToIntersections(ref, cb);
    }
  }, [ref, cb]);

  return [setRef];
};

export default useIntersectionObserver;
