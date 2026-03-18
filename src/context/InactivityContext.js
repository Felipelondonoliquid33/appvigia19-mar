import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const InactivityContext = createContext(null);

const INACTIVITY_TIME = 10 * 60 * 1000; // 9 min
const WARNING_TIME = 1 * 60 * 1000;    // 1 min

export const InactivityProvider = ({ children, onTimeout }) => {
  const inactivityRef = useRef(null);
  const warningRef = useRef(null);

  const [showModalLogout, setShowModalLogout] = useState(false);

  const resetTimer = () => {
    clearTimeout(inactivityRef.current);
    clearTimeout(warningRef.current);
    setShowModalLogout(false);

    inactivityRef.current = setTimeout(() => {
      setShowModalLogout(true);

      warningRef.current = setTimeout(() => {
        onTimeout?.();
      }, WARNING_TIME);

    }, INACTIVITY_TIME);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      clearTimeout(inactivityRef.current);
      clearTimeout(warningRef.current);
    };
  }, []);

  return (
    <InactivityContext.Provider value={{ resetTimer, showModalLogout }}>
      {children}
    </InactivityContext.Provider>
  );
};

export const useInactivity = () => useContext(InactivityContext);
