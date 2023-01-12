import * as React from "react";

export const useWindowLocation = () => {
    const [ windowLocation, setWindowLocation ] = React.useState( window.location );
    const listenToPopstate = () => {
      setWindowLocation(window.location);
    };
    React.useEffect(() => {
      window.addEventListener("popstate", listenToPopstate);
      return () => {
        window.removeEventListener("popstate", listenToPopstate);
      };
    }, []);
    return windowLocation;
  };
  