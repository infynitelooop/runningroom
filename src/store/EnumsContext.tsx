import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchAllEnums } from "../services/enums";
import { useMyContext } from "./ContextApi";
import { Enums } from "../types/enums";

type EnumsContextType = {
  enums: Enums | null;
  loading: boolean;
};

const EnumsContext = createContext<EnumsContextType>({
  enums: null,
  loading: true,
});

export const EnumsProvider = ({ children }: { children: ReactNode }) => {
  const [enums, setEnums] = useState<Enums | null>(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useMyContext();

  useEffect(() => {
    if (currentUser) {
      fetchAllEnums()
        .then((data: Enums) => {
          setEnums(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching enums:", err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  return (
    <EnumsContext.Provider value={{ enums, loading }}>
      {children}
    </EnumsContext.Provider>
  );
};

export function useEnums() {
  return useContext(EnumsContext);
}
