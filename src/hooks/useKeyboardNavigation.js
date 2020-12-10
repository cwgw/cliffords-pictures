import React from "react";
import mousetrap from "mousetrap";

export default ({ onLeft, onRight }) => {
  React.useEffect(() => {
    mousetrap.bind("left", onLeft);
    mousetrap.bind("right", onRight);

    return () => {
      mousetrap.unbind("left");
      mousetrap.unbind("right");
    };
  }, [onLeft, onRight]);
};
