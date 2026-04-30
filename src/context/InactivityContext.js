import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const InactivityContext = createContext(null);

// RNF-1.4: timeout global de inactividad — 14 min espera + 1 min aviso = 15 min total
const INACTIVITY_TIME = 14 * 60 * 1000; // 14 min
const WARNING_TIME    =  1 * 60 * 1000; //  1 min → cierre a los 15 min exactos

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
