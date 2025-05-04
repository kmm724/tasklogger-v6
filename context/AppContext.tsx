// /context/AppContext.tsx
import React, { createContext, useState } from 'react';

export const AppContext = createContext({});

export const AppProvider = ({ children }: any) => {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <AppContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </AppContext.Provider>
  );
};
