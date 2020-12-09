import React from "react";

const getSize = () => {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }
  return {};
};

const useWindowSize = () => {
  const [size, setSize] = React.useState(getSize());

  function handleResize() {
    setSize(getSize());
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

export default useWindowSize;
