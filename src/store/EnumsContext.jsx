// context/EnumsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchAllEnums } from "../services/enums";
import { useMyContext } from "./ContextApi"; // 👈 import your user context

const EnumsContext = createContext({
  enums: null,
  loading: true,
});

export const EnumsProvider = ({ children }) => {
  const [enums, setEnums] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useMyContext(); // 👈 get user info

  useEffect(() => {
    if (currentUser) {  // ✅ wait until fetchUser finished
      fetchAllEnums()
        .then((data) => {
          setEnums(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching enums:", err);
          setLoading(false);
        });
    }
  }, [currentUser]); // runs only after user is fetched

  return (
    <EnumsContext.Provider value={{ enums, loading }}>
      {children}
    </EnumsContext.Provider>
  );
};

export function useEnums() {
  return useContext(EnumsContext);
}
