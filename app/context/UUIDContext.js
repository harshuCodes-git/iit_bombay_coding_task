"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Create Context
const UUIDContext = createContext();

// Create Provider Component
export const UUIDProvider = ({ children }) => {
  const [uuid, setUUID] = useState("");

  // Generate the UUID once and store it
  useEffect(() => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    setUUID(newUUID);
  }, []); // Empty dependency array to run only once

  return (
    <UUIDContext.Provider value={{ uuid }}>{children}</UUIDContext.Provider>
  );
};

// Custom Hook to use UUID Context
export const useUUID = () => useContext(UUIDContext);
